import dashboard from './dashboard';
import pages from './pages';
import utilities from './utilities';
import other from './other';
import admin from './admin';

// This is now a function, not a static object
const getMenuItems = (position = '') => {
  const items = [dashboard, pages];

  if (position === 'admin') {
    items.push(admin);
  }

  items.push(utilities, other);

  return { items };
};

export default getMenuItems;
