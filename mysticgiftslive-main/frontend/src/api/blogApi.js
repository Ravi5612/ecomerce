import axios from 'axios';

const API_URL = 'http://localhost:4000/api/blogs';

export const fetchBlogs = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // Assuming the API returns an array of blog posts
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

export const fetchBlogById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching blog with id ${id}:`, error);
    throw error;
  }
};