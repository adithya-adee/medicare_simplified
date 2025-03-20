"use server"

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server"

export async function GET(){
    try{
        const response = await prisma.product.findMany({
            include : {
                brand : true
            }
        })

        return NextResponse.json({response},{status : 200});
    }catch(error){
        return NextResponse.json({message : error},{status : 500});
    }
}