'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GOOGLE_MAPS_EMBED_URL, t } from './data';

export function Home({ ar, navigate, select }) {
    const label = (x) => t(ar, x);
    const [winterCarouselIndex, setWinterCarouselIndex] = useState(0);
    const [winterAnimationDirection, setWinterAnimationDirection] = useState(1);
    const campaignCards = [
        { title: 'New Arrival', image: '/home-card-images/new-arrival.png' },
        { title: 'Best-Sellers', image: '/home-card-images/best-sellers.png' },
        { title: 'Sales', image: '/home-card-images/sales.png' },
    ];
    const categoryCards = [
        { title: 'Top', image: '/home-card-images/category-top.png' },
        { title: 'Bottoms', image: '/home-card-images/category-bottoms.png' },
        { title: 'Accessories', image: '/home-card-images/category-accessories.png' },
        { title: 'Shoes', image: '/home-card-images/category-shoes.png' },
    ];
    const winterSelection = [
        { id: 'winter-sweatshirt', name: 'Oversized Sweatshirts', price: 850, image: '/e9b39c94-37ce-4bee-a1db-30924d5bfed3.jpeg', colors: ['Black'], sizes: ['XS', 'S', 'M', 'L', 'XL'] },
        { id: 'winter-coat', name: 'Sweater Coat', price: 1500, image: 'Rectangle 7.png', colors: ['Black'], sizes: ['XS', 'S', 'M', 'L', 'XL'] },
        { id: 'winter-bag', name: 'Concertina Phone Bag', price: 500, image: '/home-card-images/category-accessories.png', colors: ['Black'], sizes: ['One Size'] },
        { id: 'winter-jacket', name: 'Leather Jacket', price: 1300, image: 'Rectangle 9.png', colors: ['Black'], sizes: ['XS', 'S', 'M', 'L', 'XL'] },
    ];
    const rotateWinterProducts = (step) => {
        setWinterAnimationDirection(step);
        setWinterCarouselIndex((current) => (current + step + winterSelection.length) % winterSelection.length);
    };
    const orderedWinterSelection = winterSelection.map((_, index) =>
        winterSelection[(index + winterCarouselIndex) % winterSelection.length]
    );

    return <main>
        <section className="relative flex h-[56vw] min-h-[190px] items-center overflow-hidden bg-neutral-100 px-3 text-white md:h-[950px] md:max-h-none md:px-10 max-[1100px]:h-[clamp(440px,72vw,820px)] max-[820px]:h-[clamp(380px,70vw,680px)] max-[700px]:h-[clamp(300px,82vw,420px)] max-[700px]:min-h-0 max-[700px]:px-[18px]">
            <img className="absolute inset-0 h-full w-full w-contain b" src="006194cc-799c-4d07-b3ea-21cd5ac57274.jpeg" alt="" />
            <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
            <div className="relative z-10 mt-[60px] max-w-[620px] md:mt-[100px] max-[820px]:mt-0 max-[700px]:w-full max-[700px]:max-w-[540px]">
                <h1 className="w-600 mb-[18px] text-[9xl] font-bold leading-[.95] tracking-[-1px] md:text-[clamp(42px,6vw,128px)] md:tracking-[-3px] max-[1100px]:text-[clamp(48px,8vw,96px)] max-[820px]:text-[clamp(44px,9vw,76px)] max-[700px]:mb-[14px] max-[700px]:max-w-[10ch] max-[700px]:text-[clamp(40px,11vw,68px)] max-[700px]:leading-[.98] max-[700px]:tracking-[-1.5px] max-[380px]:text-[clamp(38px,11vw,48px)]">
                    {label('Wear Your Vibe')}
                </h1>
                <button
                    className="mt-[50px] mr-1 !bg-black px-[11px] py-[6px] text-[8px] !text-white md:px-[22px] md:py-[12px] md:text-[11px] ml-[10px] max-[700px]:mt-4 max-[700px]:mr-[6px] max-[700px]:ml-0 max-[700px]:inline-flex max-[700px]:min-h-10 max-[700px]:items-center max-[700px]:justify-center max-[700px]:px-3 max-[700px]:py-2 max-[700px]:!text-xs"
                    onClick={() => navigate('shop')}
                >
                    {label('Shop Now')}
                </button>
                <a
                    className="mt-[50px] mr-1 !bg-white px-[11px] py-[6px] text-[8px] !text-black md:px-[22px] md:py-[12px] md:text-[15px] ml-[10px] max-[700px]:mt-4 max-[700px]:mr-[6px] max-[700px]:ml-0 max-[700px]:inline-flex max-[700px]:min-h-10 max-[700px]:items-center max-[700px]:justify-center max-[700px]:px-3 max-[700px]:py-2 max-[700px]:text-xs"
                    href="/collections"
                >
                    {label('Collections')}
                </a>
            </div>
        </section>

        <section className="px-[9px] pt-7 md:px-[26px] mt-[64px] mb-[64px] max-[820px]:mt-[clamp(32px,7vw,56px)] max-[700px]:mt-[38px] max-[700px]:mb-[38px]">
            <div className="grid grid-cols-3 gap-[5px] md:gap-[24px] max-[700px]:gap-2">
                {campaignCards.map(({ title, image }) => (
                    <button
                        className="group relative aspect-square overflow-hidden bg-neutral-600 text-left"
                        type="button"
                        key={title}
                        aria-label={label(title)}
                        onClick={() => navigate('shop')}
                    >
                        <img className="absolute inset-0 h-full w-full object-cover" src={image} alt="" />
                        <span className="absolute inset-0 bg-black/20" aria-hidden="true" />
                        <span className="absolute bottom-[7px] left-[7px] z-10 text-[8px] text-white md:bottom-[10px] md:left-[10px] md:text-xl max-[700px]:text-[clamp(10px,2.8vw,14px)]">{label(title)}</span>
                    </button>
                ))}
            </div>
        </section>

        <section className="w-full px-[9px] pt-4 md:px-[26px] md:pt-[30px] mt-[64px] max-[820px]:mt-[clamp(32px,7vw,56px)] max-[700px]:mt-[38px]">
            <p className="mb-[13px] text-[7px] font-semibold md:mb-5 md:text-2xl max-[700px]:text-[15px]">{label('Shop By Category')}</p>
            <div className="grid grid-cols-4 gap-[5px] md:gap-[20px] max-[700px]:gap-[7px]">
                {categoryCards.map(({ title, image }) => (
                    <button
                        className="relative overflow-hidden bg-neutral-200 md:aspect-[.84] max-[700px]:aspect-[.82]"
                        type="button"
                        key={title}
                        onClick={() => navigate('shop')}
                    >
                        <img className="absolute inset-0 h-full w-full object-cover" src={image} alt="" />
                        <span className="absolute left-1/2 top-1/2 z-10 max-w-[calc(100%-4px)] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-white px-[5px] py-[3px] text-[8px] text-black md:px-8 md:py-[15px] md:text-[18px] md:font-semibold max-[700px]:whitespace-normal max-[700px]:px-1 max-[700px]:py-[5px] max-[700px]:text-center max-[700px]:text-[clamp(9px,2.6vw,12px)] max-[380px]:text-[9px]">{label(title)}</span>
                    </button>
                ))}
            </div>
        </section>

        <section className="px-[9px] pt-[18px] md:px-[26px] md:pt-[46px] mt-[64px] max-[820px]:mt-[clamp(32px,7vw,56px)] max-[700px]:mt-[38px]">
            <div className="mb-[13px] flex min-h-[23px] items-center justify-start" dir="ltr">
                <p className="text-[7px] md:text-2xl font-semibold max-[700px]:text-[15px]">{ar ? 'مجموعة الشتاء' : 'Winter collection'}</p>
            </div>
            <div
                key={winterCarouselIndex}
                className={`flex snap-x gap-[7px] md:gap-[10px] max-[700px]:w-full max-[700px]:overflow-x-auto max-[700px]:[scroll-snap-type:x_mandatory] max-[700px]:[scrollbar-width:none] max-[700px]:[padding-inline-end:12%] max-[700px]:[&::-webkit-scrollbar]:hidden ${winterAnimationDirection > 0 ? 'winter-products-next' : 'winter-products-previous'}`}
            >
                {orderedWinterSelection.map((product) => (
                    <button
                        className="min-w-0 basis-[calc(25%_-_6px)] snap-start text-start md:basis-[calc(25%_-_8px)] max-[700px]:basis-[calc(66%_-_4px)] max-[700px]:shrink-0"
                        type="button"
                        key={product.id}
                        onClick={() => select(product)}
                    >
                        <span className="relative block aspect-square overflow-hidden bg-neutral-200">
                            <img className="absolute inset-0 h-full w-full object-cover" src={product.image} alt="" />
                        </span>
                        <span className="mt-[5px] block text-[7px] leading-[1.2] md:text-xl max-[700px]:text-xs">{product.name}</span>
                        <span className="block text-[7px] md:text-xl max-[700px]:text-xs">{product.price} LE</span>
                    </button>
                ))}
            </div>
            <div className="mt-5 flex justify-center gap-6" dir="ltr">
                <button
                    className="grid size-[46px] place-items-center rounded-full border-2 border-sky-600 bg-white text-sky-600 shadow-sm transition-colors hover:bg-sky-600 hover:text-white md:size-[50px]"
                    type="button"
                    aria-label={ar ? 'المنتجات السابقة' : 'Previous products'}
                    onClick={() => rotateWinterProducts(-1)}
                >
                    <ChevronLeft className="size-7" strokeWidth={2.5} />
                </button>
                <button
                    className="grid size-[46px] place-items-center rounded-full border-2 border-sky-600 bg-white text-sky-600 shadow-sm transition-colors hover:bg-sky-600 hover:text-white md:size-[50px]"
                    type="button"
                    aria-label={ar ? 'المنتجات التالية' : 'Next products'}
                    onClick={() => rotateWinterProducts(1)}
                >
                    <ChevronRight className="size-7" strokeWidth={2.5} />
                </button>
            </div>
        </section>

        <section className="mt-[18px] bg-black px-4 py-5 text-center text-white md:mt-40 md:px-5 md:py-[248px] md:mb-20 max-[820px]:mt-10 max-[820px]:py-[clamp(56px,10vw,96px)] max-[700px]:mt-8 max-[700px]:px-4 max-[700px]:py-12">
            <p className="mb-3 text-sm leading-[1.35] md:mb-6 md:text-4xl max-[700px]:text-[clamp(18px,5vw,24px)]">{ar ? 'خصم 25٪ إذا طلبت من الموقع' : '25% sale if you order from website'}</p>
            <button
                className=" !bg-white px-3 py-[6px] text-[8px] !text-black md:px-[24px] md:py-[10px] md:text-[24px]"
                onClick={() => navigate('shop')}
            >
                {label('Shop Now')}
            </button>
        </section>

        <section className="px-[9px] pt-3 md:px-[26px] md:pt-[46px] md:mb-44 max-[820px]:mt-[clamp(32px,7vw,56px)] max-[700px]:mt-[38px]">
            <p className="mb-[10px] text-[9px] md:mb-5 md:text-2xl font-semibold max-[700px]:text-[15px]">{ar ? 'متجرنا' : 'Our store'}</p>
            <div className="grid grid-cols-2 gap-1 max-[700px]:gap-2">
                <div className="relative aspect-[1.45] overflow-hidden bg-neutral-200">
                    <img className="absolute inset-0 h-full w-full object-cover" src="5d59833a-0f59-4800-aae3-d1b9b28e2c69.jpeg" alt="" />
                </div>
                <div className="relative aspect-[1.45] overflow-hidden bg-neutral-100">
                    <iframe
                        className="absolute inset-0 h-full w-full border-0"
                        title={ar ? 'موقع متجر دكان لبس على الخريطة' : 'Dokan Lebss store location map'}
                        src={GOOGLE_MAPS_EMBED_URL}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                    />
                </div>
            </div>
        </section>
    </main>;
}
