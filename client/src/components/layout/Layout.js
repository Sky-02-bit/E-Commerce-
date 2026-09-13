import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Helmet } from 'react-helmet'
import { Toaster } from 'react-hot-toast';

const Layout = ({ children, title, description, keywords, author }) => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />

        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />

        <title>{title}</title>

      </Helmet>
      <Header />
      <main style={{ minHeight: '78vh' }}>
        <Toaster />
        {children}
      </main>
      <Footer />
    </div>
  );
};
Layout.defaultPops = {
  title: "Sky Electron - shop now",
  description: "Mern Stack project",
  keywords: "mern , node.js, react,mongodb",
  author: "Sky"

}

export default Layout;