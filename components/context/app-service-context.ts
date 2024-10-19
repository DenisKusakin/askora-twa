import {createContext} from "react";
import {AppService} from "@/components/services/AppService";

export const AppServiceContext = createContext<AppService>(null)