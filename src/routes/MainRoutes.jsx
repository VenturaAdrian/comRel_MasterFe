import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';



// dashboard routing
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
const Register = Loadable(lazy(() => import('../views/pages/authentication/Register')));



// ==============================|| MAIN ROUTING ||============================== //
const RoleAccess = () => {
    if(localStorage.getItem("user") === null){
        return <Navigate to="/"replace/>;
    }else{
        return <MainLayout/>
    }
}



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
      element: <AddForm/>
    },
    {
      path: 'history',
      element: <History/>
    },
    {
      path: 'report',
      element: <Reports/>
    },
    {
      path: 'review-post',
      element: <ReviewPost/>
    },
    {
      path: 'review',
      element: <Review/>
    },
    {
      path:'edit',
      element:<EditForm/>
    },
    {
      path:'register',
      element: <Register/>
    }
  ]
};

export default MainRoutes;
