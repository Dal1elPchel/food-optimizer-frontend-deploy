import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import FiltersPage from '@/pages/filtersPage/FiltersPage.js';
import MainPage from '@/pages/mainPage/MainPage.js';
import OrderItemPage from '@/pages/orderItemPage/OrderItemPage';
import OrderPage from '@/pages/orderPage/OrderPage';
import Header from '@/widgets/Header/ui/Header.js';

const queryClient = new QueryClient();

function App() {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Header />

                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/filters" element={<FiltersPage />} />
                        <Route path="/dishlist" element={<OrderPage />} />
                        <Route path="/dishlist/:id" element={<OrderItemPage />} />
                    </Routes>
                </BrowserRouter>
            </QueryClientProvider>
        </>
    );
}

export default App;
