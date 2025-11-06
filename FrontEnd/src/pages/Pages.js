import { lazy } from 'react';

const Landing = lazy(() => import('./Landing/Landing'));
const Login = lazy(() => import('./Login/Login'));
const Register = lazy(() => import('./Register/Register'));
const Home = lazy(() => import('./Home/Home'));
const Blogs = lazy(() => import('./Blogs/Blogs'));
const CreateBlog = lazy(() => import('./Blogs/CreateBlog'));
const Contact = lazy(() => import('./Contact/Contact'));
const Events = lazy(() => import('./Events/Events'));
const CreateEvents = lazy(() => import('./Events/CreateEvents'));
const Chats = lazy(() => import('./Chats/Chats'));
const Profile = lazy(() => import('./Profile/Profile'));
const Login_Required = lazy(() => import('./Login_Required/Login_Required'))



export { Landing, Login_Required, Login, Register, Home, Blogs, CreateBlog, Contact, Events, CreateEvents, Chats, Profile };
