"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";

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
import { fetchUserData } from "@/store/actions/userDataActions";

const page = () => {
  const dispatch = useDispatch();
    const isAuthenticated = useSelector(
        (state) => state.registration.isAuthenticated
      );

    useEffect(() => {
      dispatch(appActions());
    }, [dispatch]);

    useEffect(() => {
        if (isAuthenticated) {
          const token = JSON.parse(localStorage.getItem('token') || '');
          console.log({token});
          dispatch(fetchUserData(token));
        }
      }, [isAuthenticated, dispatch]);
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
