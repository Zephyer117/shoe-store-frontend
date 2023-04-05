import ProductDetailsCarusol from '@/components/ProductDetailsCarusol'
import RelatedProducts from '@/components/RelatedProducts'
import Wrapper from '@/components/Wrapper'
import React, { use, useState } from 'react'
import { IoMdHeartEmpty } from 'react-icons/io'
import { fetchDataFromApi } from '@/utils/api'
import { getDiscounted } from '@/utils/helper'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { useSelector, useDispatch } from 'react-redux'
import { addToCart } from '@/store/cartSlice'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ProductDetails = ({ product, products }) => {
  const [selectedSize, setSelectedSize] = useState()
  const [showError, setShowError] = useState(false)
  const dispatch = useDispatch()
  const p = product?.data?.[0]?.attributes

  const notify = () => {
    toast.success('Success, Check Cart', {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    })
  }

  return (
    <>
      <div className="w-full md:py-20">
        <ToastContainer />
        <Wrapper>
          <div className="flex flex-col lg:flex-row md:px-10 gap-[50px] lg:gap-[100px]">
            <div className="w-full md:auto flex-[1.5] max-w-[500px] lg:max-w-full mx-auto lg:mx-0">
              <ProductDetailsCarusol images={p.image.data} />
            </div>
            <div className="flex-[1] py-3">
              <div className="text-[34px] font-semibold mb-2 leading-none">
                {p.name}
              </div>
              <div className="text-lg font-semibold mb-5">{p.subtitle}</div>
              <div className="flex items-center">
                <p className="mr-2 text-lg font-semibold">
                  MRP : &#8377;{p.price}
                </p>
                {p.original_price && (
                  <>
                    <p className="text-base font-medium line-through">
                      &#8377;{p.original_price}
                    </p>
                    <p className="ml-auto text-base font-medium text-green-600">
                      {getDiscounted(p.original_price, p.price)} % off
                    </p>
                  </>
                )}
              </div>
              <div className="text-md font-semibold text-black/[0.5]">
                incl. of taxes
              </div>
              <div className="text-md font-semibold text-black/[0.5] mb-20">
                {`{Also include all applicable duties}`}
              </div>
              <div className="mb-10">
                {/*Heading Start*/}
                <div className="flex justify-between mb-2">
                  {/* Select Size start*/}
                  <div className="text-md font-semibold">Select Size</div>
                  {/* Select Size start*/}
                  {/* Select Guide start*/}
                  <div className="text-md font-semibold text-black/[0.5]">
                    Select Guide
                  </div>
                  {/* Select Guide End*/}
                </div>
                {/*Heading Ends*/}

                {/*Size Start*/}
                <div id="sizesGrid" className="grid grid-cols-3 gap-2">
                  {p.size.data.map((item, i) => (
                    <div
                      key={i}
                      className={`border rounded-md text-center py-3 font-medium ${
                        item.enabled
                          ? 'hover:border-black cursor-pointer'
                          : 'cursor-not-allowed bg-black/[0.3] opacity-50'
                      } ${selectedSize === item.size ? 'border-black' : ''}`}
                      onClick={() => {
                        setSelectedSize(item.size)
                        setShowError(false)
                      }}
                    >
                      {item.size}
                    </div>
                  ))}
                </div>
                {/*Size Ends*/}
                {/*Error start*/}
                {showError && (
                  <div className="text-red-600 mt-1">
                    Size selection is required
                  </div>
                )}
                {/*Size Ends*/}
              </div>
              <button
                onClick={() => {
                  if (!selectedSize) {
                    setShowError(true)
                    document.getElementById('sizesGrid').scrollIntoView({
                      block: 'center',
                      behavior: 'smooth',
                    })
                  } else {
                    dispatch(
                      addToCart({
                        ...product?.data?.[0],
                        selectedSize,
                        oneQuantityPrice: p.price,
                      }),
                    )
                    notify()
                  }
                }}
                className="w-full py-4 rounded-full bg-black text-white text-lg font-medium transition-transform active:scale-95 mb-3 hover:opacity-75"
              >
                Add To Cart
              </button>
              <button className="w-full py-4 rounded-full border border-black text-lg font-medium transition-transform active:scale-95 flex items-center justify-center gap-2 hover:opacity-75 mb-10">
                Wishlist
                <IoMdHeartEmpty size={30} />
              </button>
              <div>
                <div className="text-lg font-bold mb-5">Product Details</div>
                <div className="markdown text-md mb-5">
                  <ReactMarkdown>{p.description}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
          <RelatedProducts products={products} />
        </Wrapper>
      </div>
    </>
  )
}

export default ProductDetails

export async function getStaticPaths() {
  const products = await fetchDataFromApi('/api/products?populate=*')

  const paths = products.data.map((p) => ({
    params: { slug: p.attributes.slug },
  }))

  return {
    paths,
    fallback: false,
  }
}

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticProps({ params: { slug } }) {
  const product = await fetchDataFromApi(
    `/api/products?populate=*&filters[slug][$eq]=${slug}`,
  )
  const products = await fetchDataFromApi(
    `/api/products?populate=*&[filters][slug][$ne]=${slug}`,
  )

  return {
    props: {
      product,
      products,
    },
  }
}
