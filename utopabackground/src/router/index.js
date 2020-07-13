import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import login from '../components/login/login';
import forgot from '@/components/login/forgot'
import system from '@/components/system/system'
import userList from '@/components/system/userList'
import createUser from '@/components/system/createUser'
import roleList from '@/components/system/roleList'
import identifyManagement from '@/components/identifyManagement/identifyManagement'
import identifyList from '@/components/identifyManagement/identifyList'
import applicationManagement from '@/components/applicationManagement/applicationManagement'
import applicationList from '@/components/applicationManagement/applicationList'
import applicationCreate from '@/components/applicationManagement/applicationCreate'
import total from '@/components/material/total'
import manger from '@/components/material/manger'
import applicationInfo from '@/components/applicationManagement/applicationInfo'
import createRole from '@/components/system/createRole'
import middleUserSetting from '@/components/middleUserSetting/middleUserSetting'
import middleUserList from '@/components/middleUserSetting/middleUserList'
import createMiddleUser from '@/components/middleUserSetting/createMiddleUser'
import assetsManager from '@/components/assetsManager/assetsManager'
import positionList from '@/components/assetsManager/positionList'
import playList from '@/components/play/playList'
import logout from '@/components/login/logout'
import firstNav from '@/components/firstNav'
import material from '@/components/material/material'
import version from '@/components/version'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home,
      children:[
        {
          path:'/system',
          name:'system',
          component: system,
          children:[
            {
              path:'/system/userlist',
              name:'userList',
              component: userList,
              children:[
                {
                  path:'/system/userlist/createuser',
                  name:'createUser',
                  component: createUser
                }
              ]
            },
            {
              path:'/system/rolelist',
              name:'roleList',
              component: roleList,
              children:[
                {
                  path:'/system/rolelist/createrole',
                  name:'createRole',
                  component: createRole
                }
              ]
            }
          ]
        },
        {
          path:'/middleusersetting',
          name:'middleUserSetting',
          component: middleUserSetting,
          children:[
            {
              path:'/middleusersetting/middleuserlist',
              name:'middleUserList',
              component: middleUserList,
              children:[
                {
                  path:'/middleusersetting/middleuserlist/createmiddleuser',
                  name:'createMiddleUser',
                  component: createMiddleUser
                }
              ]
            }
          ]
        },
        {
          path:'/assetsmanager',
          name:'assetsManager',
          component: assetsManager,
          children:[
            {
              path:'/assetsmanager/positionlist',
              name:'positionList',
              component: positionList,
            }
          ]
        },
        {
          path: '/applicationManagement',
          name: 'applicationManagement',
          component: applicationManagement,
          children: [
            {
              path: '/applicationManagement/applicationList',
              name: 'applicationList',
              component: applicationList,
              children: [
                {
                  path: '/applicationManagement/applicationList/applicationCreate',
                  name: 'applicationCreate',
                  component: applicationCreate,
                },
                {
                  path: '/applicationManagement/applicationList/applicationInfo',
                  name: 'applicationInfo',
                  component: applicationInfo,
                }
              ]
            }
          ]
        },
        {
          path: '/identifyManagement',
          name: 'identifyManagement',
          component: identifyManagement,
          children: [
            {
              path: '/identidfyManagement/identifyList',
              name: 'identifyList',
              component: identifyList
            },
            {
              path: '/identidfyManagement/identifyList/state1',
              name: 'checkState1',
              component: identifyList
            },
            {
              path: '/identidfyManagement/identifyList/state2',
              name: 'checkState2',
              component: identifyList
            },
            {
              path: '/identidfyManagement/identifyList/state3',
              name: 'checkState3',
              component: identifyList
            },
          ]
        },
        {
          path:'/material',
          name:'material',
          component:material,
          children:[
            {
              path:'/material/music',
              name:'music',
              component:total //音乐
            },
            {
              path:'/material/animation',
              name:'animation',
              component:total //动画
            },
            {
              path:'/material/container',
              name:'container',
              component:total //载体模型
            },
            {
              path:'/material/nomarl',
              name:'nomarl',
              component:total //普通模型
            },
            {
              path:'/material/online',
              name:'online',
              component:total  //在线视频
            },
            {
              path:'/material/mp4',
              name:'mp4',
              component:total   //mp4
            }
          ]
        },
        {
          path:'/material/manger',
          name:'manger',
          component:manger

        },
        {
          path:'/play/playList',
          name:'playList',
          component:playList
        },
        {
          path:'/firstNav',
          name:'firstNav',
          component:firstNav
        }
      ]
    },
    {
      path:'/login',
      name:'login',
      component:login
    },
    {
      path:'/forgot',
      name:'forgot',
      component:forgot
    },
    {
      path:'/logout',
      name:'logout',
      component:logout
    },
    {
      path:'/version',
      name:'version',
      component:version
    }
  ]
})
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
