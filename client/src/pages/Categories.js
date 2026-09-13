import useCategory from '../hooks/useCategory';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
// get category

const Categories = () => {
    const categories = useCategory();
    return (
        <Layout title={'All Categories'}>
            <div className='container'>
                <div className='row'>
                    {categories?.map(c => (
                        <div className='col-md-6'>
                            {/* after clicking to the button it redirect to that perticular category-product */}
                            <Link to={`/category/${c.slug}`} className='btn btn-primary mt-5 mb-3 gx-3 gy-3' key={c._id} style={{ backgroundColor: '#fb641b', border: 'none' }}>
                                {c.name}
                            </Link>

                        </div>
                    ))}

                </div>
            </div>
        </Layout>
    )
}

export default Categories;