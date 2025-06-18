// assets
import { 
  IconDeviceIpadPlus, 
  IconHistory, 
  IconClipboardText,
  IconBrandFacebook 
} from '@tabler/icons-react';



// constant
const icons = {
  IconDeviceIpadPlus,
  IconHistory,
  IconClipboardText,
  IconBrandFacebook
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'tools',
  title: 'Tools',
  caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'add-form-request',
      title: 'Add Request',
      type: 'item',
      url: '/addform',
      icon: icons.IconDeviceIpadPlus,
    },
    {
      id: 'history',
      title: 'History',
      type: 'item',
      url: '/history',
      icon: icons.IconHistory,
    },
    {
      id: 'report',
      title: 'Reports',
      type: 'item',
      url: '/report',
      icon: icons.IconClipboardText,
    },
    {
      id: 'preview-post',
      title: 'Preview Post',
      type: 'item',
      url: '/review-post',
      icon: icons.IconBrandFacebook,
    }

  ]
};

export default pages;
