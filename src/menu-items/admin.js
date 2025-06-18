import {IconUserPlus} from '@tabler/icons-react'

const icons = {
  IconUserPlus
};
const admin ={
id: 'admin-tools',
  title: 'Admin Tools',
  type: 'group',
  children: [
    {
      id: 'register-user',
      title: 'Register User',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.IconUserPlus,
      breadcrumbs: false
    }
  ]
}

export default admin;