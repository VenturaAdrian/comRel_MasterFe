import { lazy, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import axios from 'axios';
import config from 'config';

// dashboard routing
const DashboardDefault1 = Loadable(lazy(() => import('views/dashboard')));
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));
const AddForm = Loadable(lazy(() => import('../views/forms/addforms')));
const History = Loadable(lazy(() => import('../views/history')));
const Reports = Loadable(lazy(() => import('../views/report/report')));
const ReviewPost = Loadable(lazy(() => import('../views/preview-post')));
const Review = Loadable(lazy(() => import('../views/history/review')));
const EditForm = Loadable(lazy(() => import('../views/forms/editform')));
const Pending = Loadable(lazy(() => import('../views/history/pending')));
const Register = Loadable(lazy(() => import('../views/pages/authentication/Register')));
const UserPanel = Loadable(lazy(() => import('../views/pages/admin/userspanel')));
const UserEdit = Loadable(lazy(() => import('../views/pages/admin/useredit')));
const UserLogs = Loadable(lazy(() => import('../views/pages/admin/userslogs')));
const RequestLogs = Loadable(lazy(() => import('../views/forms/requestlogs')));

// ==============================|| MAIN ROUTING ||============================== //
const RoleAccess = () => {
  const empInfo = JSON.parse(localStorage.getItem('user'));
  const [redirect, setRedirect] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (empInfo?.is_active === true) {
      setOpenSnackbar(true);

      const timer = setTimeout(() => {
        setRedirect(true);
      }, 3000); // Delay for 3 seconds

      return () => clearTimeout(timer);
    } else if (empInfo?.is_active === false) {
      axios.post(`${config.baseApi}/users/isactivechecker`, {
        id_master: empInfo.id_master,
        is_active: 1
      });
    }
  }, []);

  if (redirect) {
    return <Navigate to="/" replace />;
  }

  if (empInfo?.is_active === false) {
    return <MainLayout />;
  }

  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="warning" variant="filled">
          YOU ARE CURRENTLY LOGGED IN, PLEASE LOG OUT YOUR ACCOUNT
        </Alert>
      </Snackbar>
    </>
  );
};

const MainRoutes = {
  path: '/',
  element: <RoleAccess />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'typography',
      element: <UtilsTypography />
    },
    {
      path: 'color',
      element: <UtilsColor />
    },
    {
      path: 'shadow',
      element: <UtilsShadow />
    },
    {
      path: '/sample-page',
      element: <SamplePage />
    },
    {
      path: 'addform',
      element: <AddForm />
    },
    {
      path: 'history',
      element: <History />
    },
    {
      path: 'report',
      element: <Reports />
    },
    {
      path: 'review-post',
      element: <ReviewPost />
    },
    {
      path: 'review',
      element: <Review />
    },
    {
      path: 'edit',
      element: <EditForm />
    },
    {
      path: 'register',
      element: <Register />
    },
    {
      path: 'pending',
      element: <Pending />
    },
    {
      path: 'userpanel',
      element: <UserPanel />
    },
    {
      path: 'usereditpanel',
      element: <UserEdit />
    },
    {
      path: 'userlogs',
      element: <UserLogs />
    },
    {
      path: 'request-logs',
      element: <RequestLogs />
    }
  ]
};

export default MainRoutes;
