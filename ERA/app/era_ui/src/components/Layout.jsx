import {Helmet} from 'react-helmet';
import Header from './Header';

const Layout = ({title, content, children}) => (
    <>
        <Helmet>
            <title>{title}</title>
            <meta name='description' content={content}/>
        </Helmet>
        <Header/>
        <>{children}</>
    </>
);

export default Layout;
