/*
  # Add increment view count function

  1. Functions
    - `increment_view_count` - Safely increment post view count
*/

CREATE OR REPLACE FUNCTION increment_view_count(post_id uuid)
RETURNS void AS $$
BEGIN
    UPDATE posts 
    SET view_count = view_count + 1 
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;