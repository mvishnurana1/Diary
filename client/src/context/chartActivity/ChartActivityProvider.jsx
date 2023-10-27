import { createContext } from "react";

const ChartActivityContext = createContext();

function ChartActivityProvider({children}) {
    return (
        <ChartActivityContext.Provider>
            {children}
        </ChartActivityContext.Provider>
    );
}

export { ChartActivityContext, ChartActivityProvider };
