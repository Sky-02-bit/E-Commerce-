import React from 'react';
import Layout from '../components/layout/Layout';

const Policy = () => {
  return (
    <Layout title={"Privacy Policy"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/contactus.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <p>Lorem ipsum odor amet, consectetuer adipiscing elit. Lacus gravida aliquam proin at nostra. Neque ridiculus magnis nascetur enim; rhoncus lobortis pellentesque. Parturient primis fames sociosqu phasellus ad consectetur; penatibus vulputate. Lectus non mollis feugiat metus suspendisse; condimentum facilisi et aptent. Urna quisque consectetur facilisis scelerisque feugiat egestas eget duis. Dapibus rhoncus magna volutpat mauris semper aenean? Primis vestibulum turpis ligula senectus; rutrum sodales inceptos. Augue cursus sollicitudin integer pellentesque sociosqu metus maximus et fusce.

          </p>

        </div>
      </div>
    </Layout>
  );
};

export default Policy;