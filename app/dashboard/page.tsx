"use client";

import { Product } from "@/type/interface";
import { useState, useEffect } from "react";

export default function DashboardPage() {
    const [products, setProducts] = useState([] as Product[]);
    const [loading, setLoading] = useState(true);
    
    const displayProducts = async () =>{
        setLoading(true);
        const response = await fetch('/api/products')
        const data = await response.json();
        setProducts(data.response);
        setLoading(false);
    }

    useEffect(()=>{
        displayProducts();
    }, []);
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="mt-2">Welcome to your dashboard!</p>
            {products.length > 0 && (
                products.map((product)=>{
                    return(
                        <div key={product.product_id} className="border p-4 mt-4">
                            <p>{product.product_name}</p>
                        </div>
                    )
                })
    )}
        </div>
    );
}
