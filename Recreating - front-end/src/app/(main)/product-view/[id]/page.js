"use client";
import { Row } from 'react-bootstrap'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb'
import ProductPage from '@/components/product-page/ProductPage'
import RelatedProduct from '@/components/product-page/related-product/RelatedProduct'
import { useParams } from 'next/navigation'

const page = () => {
    const params = useParams()
    const productId = params.id

    return (
        <>
            <Breadcrumb title={"Product Details"} />
            <section className="gi-single-product padding-tb-40">
                <div className="container">
                    <Row>
                        <ProductPage
                            productId={productId}
                            order={"order-lg-last order-md-first"}
                            none={""}
                            lg={9}
                        />
                    </Row>
                </div>
            </section>
            <RelatedProduct productId={productId} />
        </>
    )
}

export default page
