import { SessionProvider } from "next-auth/react";
import ProviderSignUpPage from "./provider-sign-up";

export default function Provider() {
    return (
        <SessionProvider>
            <ProviderSignUpPage/>
        </SessionProvider>
    );
}