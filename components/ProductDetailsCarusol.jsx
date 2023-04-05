import React from 'react'
import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader
import { Carousel } from 'react-responsive-carousel'
import { BiArrowBack, BiArrowFromRight, BiUpArrow } from 'react-icons/bi'

const ProductDetailsCarusol = ({ images }) => {
  return (
    <>
      <Carousel
        infiniteLoop={true}
        showIndicators={false}
        showStatus={false}
        thumbWidth={60}
        className="productCarousel"
      >
        {images?.map((img) => (
          <img
            key={img.id}
            src={img.attributes.url}
            alt={img.attributes.name}
          />
        ))}
      </Carousel>
    </>
  )
}

export default ProductDetailsCarusol
