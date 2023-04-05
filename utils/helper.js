export const getDiscounted = (originalprice, discountedPrice) => {
  const discount = originalprice - discountedPrice

  const discountPercentage = (discount / originalprice) * 100

  return discountPercentage.toFixed(2)
}
