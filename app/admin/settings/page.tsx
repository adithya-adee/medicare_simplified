"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RocketIcon, HeartPulse, ShieldCheck } from "lucide-react";

export default function PlatformInfoPage() {
  // Static platform information
  const platformInfo = {
    name: "Medicare Simplified",
    description: "Your trusted online medical pharmacy delivering healthcare solutions with ease and reliability.",
    established: "2022",
    mission: "Making healthcare accessible to everyone through an intuitive digital experience",
    features: [
      "24/7 Online Prescription Services",
      "Fast Medication Delivery",
      "Expert Pharmacist Consultation",
      "Secure Health Records Management"
    ]
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Platform Information</h1>
      
      <Card>
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center text-blue-800">
            <HeartPulse className="h-6 w-6 mr-2 text-blue-600" />
            {platformInfo.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700">{platformInfo.description}</p>
              
              <p className="mt-4">
                Medicare Simplified is revolutionizing how patients access healthcare services online. 
                Our platform combines the convenience of digital ordering with the personal care of 
                traditional pharmacy services, ensuring you receive the medications and health products 
                you need without hassle.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="border rounded-lg p-4 bg-green-50">
                <div className="flex items-center mb-2">
                  <RocketIcon className="h-5 w-5 mr-2 text-green-600" />
                  <h3 className="font-semibold text-green-800">Our Mission</h3>
                </div>
                <p className="text-sm text-gray-700">{platformInfo.mission}</p>
              </div>
              
              <div className="border rounded-lg p-4 bg-purple-50">
                <div className="flex items-center mb-2">
                  <ShieldCheck className="h-5 w-5 mr-2 text-purple-600" />
                  <h3 className="font-semibold text-purple-800">Established</h3>
                </div>
                <p className="text-sm text-gray-700">Proudly serving patients since {platformInfo.established}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium text-gray-800 mb-3">Key Features</h3>
              <ul className="grid gap-2">
                {platformInfo.features.map((feature, index) => (
                  <li key={index} className="flex items-center border-b pb-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-8 text-sm text-muted-foreground bg-gray-50 p-4 rounded-md">
              Medicare Simplified is committed to patient privacy, data security, and healthcare excellence.
              For more information or to update platform details, please contact the system administrator.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}