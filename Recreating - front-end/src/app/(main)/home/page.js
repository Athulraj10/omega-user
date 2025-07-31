"use client";

import { useDispatch } from "react-redux";

import Category from "@/components/category/Category";
import Deal from "@/components/deal/Deal";
import HeroSlider from "@/components/hero/HeroSlider";

import { appActions } from "@/store/actions/appActions";

import Banner from "@/components/banner/Banner";
import OfferBanners from "@/components/banner/OfferBanners";
import LatestBlog from "@/components/blog/LatestBlog";
import Services from "@/components/service/Services";
import Trending from "@/components/trending/Trending";
import GroceryArrials from "@/components/arrivals/GroceryArrials";
import { useEffect } from "react";

const page = () => {
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(appActions());
    }, [dispatch]);
    return (
        <>
            <HeroSlider />
            <Category /> 
            <Deal />
            {/* <Banner />
            <GroceryArrials />
            <OfferBanners />
            <Services />
            <Trending />
            <LatestBlog /> */}
        </>
    )
}

export default page
