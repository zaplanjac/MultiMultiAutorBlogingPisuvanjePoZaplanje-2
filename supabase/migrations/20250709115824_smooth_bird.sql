/*
  # Create blog platform schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `name` (text)
      - `role` (user_role enum: super_admin, editor, author, reader)
      - `avatar` (text, optional)
      - `bio` (text, optional)
      - `joined_at` (timestamp)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `excerpt` (text)
      - `slug` (text, unique)
      - `author_id` (uuid, references profiles)
      - `category` (text, default 'Општи')
      - `tags` (text array)
      - `status` (post_status enum: draft, published, archived)
      - `featured_image` (text, optional)
      - `published_at` (timestamp, optional)
      - `scheduled_at` (timestamp, optional)
      - `view_count` (integer, default 0)
      - `is_feature` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for different user roles
    - Public can read published posts and profiles
    - Authors can manage their own posts
    - Editors and admins have broader permissions

  3. Functions
    - Auto-update updated_at timestamps
    - Handle new user registration
</*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('super_admin', 'editor', 'author', 'reader');
CREATE TYPE post_status AS ENUM ('draft', 'published', 'archived');

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, role, joined_at, is_active, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        'author'::user_role,
        now(),
        true,
        now(),
        now()
    );
    RETURN NEW;
END;
$$ language 'plpgsql' security definer;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text UNIQUE NOT NULL,
    name text NOT NULL,
    role user_role DEFAULT 'author'::user_role,
    avatar text,
    bio text,
    joined_at timestamptz DEFAULT now(),
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    content text NOT NULL,
    excerpt text NOT NULL,
    slug text UNIQUE NOT NULL,
    author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    category text DEFAULT 'Општи'::text,
    tags text[] DEFAULT '{}'::text[],
    status post_status DEFAULT 'draft'::post_status,
    featured_image text,
    published_at timestamptz,
    scheduled_at timestamptz,
    view_count integer DEFAULT 0,
    is_feature boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS posts_author_id_idx ON posts(author_id);
CREATE INDEX IF NOT EXISTS posts_status_idx ON posts(status);
CREATE INDEX IF NOT EXISTS posts_published_at_idx ON posts(published_at);
CREATE INDEX IF NOT EXISTS posts_category_idx ON posts(category);
CREATE INDEX IF NOT EXISTS posts_is_feature_idx ON posts(is_feature);
CREATE INDEX IF NOT EXISTS posts_tags_idx ON posts USING gin(tags);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    TO public
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    TO public
    USING (auth.uid() = id);

CREATE POLICY "Super admins can update any profile"
    ON profiles FOR UPDATE
    TO public
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'super_admin'::user_role
        )
    );

CREATE POLICY "Super admins can delete profiles"
    ON profiles FOR DELETE
    TO public
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'super_admin'::user_role
        )
    );

-- Posts policies
CREATE POLICY "Published posts are viewable by everyone"
    ON posts FOR SELECT
    TO public
    USING (status = 'published'::post_status);

CREATE POLICY "Authors can view their own posts"
    ON posts FOR SELECT
    TO public
    USING (author_id = auth.uid());

CREATE POLICY "Editors and admins can view all posts"
    ON posts FOR SELECT
    TO public
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() 
            AND role = ANY(ARRAY['super_admin'::user_role, 'editor'::user_role])
        )
    );

CREATE POLICY "Authors can insert their own posts"
    ON posts FOR INSERT
    TO public
    WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can update their own posts"
    ON posts FOR UPDATE
    TO public
    USING (author_id = auth.uid());

CREATE POLICY "Editors and admins can update all posts"
    ON posts FOR UPDATE
    TO public
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() 
            AND role = ANY(ARRAY['super_admin'::user_role, 'editor'::user_role])
        )
    );

CREATE POLICY "Authors can delete their own posts"
    ON posts FOR DELETE
    TO public
    USING (author_id = auth.uid());

CREATE POLICY "Super admins can delete any post"
    ON posts FOR DELETE
    TO public
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'super_admin'::user_role
        )
    );

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();