import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Category from './src/models/categoryModel.js';
import Product from './src/models/productModel.js';
import User from './src/models/userModel.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Conectado a MongoDB para la carga de datos");

        
        await Category.deleteMany({});
        await Product.deleteMany({});
        await User.deleteMany({});
        console.log("Se limpiaron las categorías, productos y usuarios existentes");

        
        await User.create({
            name: "Administrador",
            email: "admin@f1.com",
            password: "Qwerty123",
            role: "admin"
        });
        console.log("Se creó el usuario administrador: admin@f1.com / Qwerty123");

        
        const catIndumentaria = await Category.create({ name: 'Indumentaria', description: 'Ropa oficial de pista y lifestyle' });
        const catAccesorios = await Category.create({ name: 'Accesorios', description: 'Gorras, mochilas y souvenirs' });
        const catColeccionables = await Category.create({ name: 'Coleccionables', description: 'Modelos a escala y memorabilia' });

        
        const productsParams = [
            {
                name: 'Campera de Lluvia Alpine F1 Team 2026',
                description: 'Campera oficial resistente al agua del equipo Alpine. Diseño premium para condiciones climáticas extremas en el paddock.',
                price: 145000,
                stock: 45,
                category: catIndumentaria._id,
                images: [
                    'https://fwncrqbostormzonvahn.supabase.co/storage/v1/object/public/imagenes/alpine-f1-team-2026-rain-jacket_ss5_p-203284841+pv-1+u-c4fu6mtxt0bcvkji1bed+v-xdixkcp71qszfnft8myt.jpg.avif',
                    'https://fwncrqbostormzonvahn.supabase.co/storage/v1/object/public/imagenes/alpine-f1-team-2026-rain-jacket_ss5_p-203284841+pv-2+u-c4fu6mtxt0bcvkji1bed+v-qhu75brqdgvcnumcwbd4.jpg.avif',
                    'https://fwncrqbostormzonvahn.supabase.co/storage/v1/object/public/imagenes/alpine-f1-team-2026-rain-jacket_ss5_p-203284841+pv-3+u-c4fu6mtxt0bcvkji1bed+v-pvctv1lwfm3coul6jaty.jpg.avif'
                ]
            },
            {
                name: 'Remera Ayrton Senna Legacy - São Paulo',
                description: 'Edición limitada en homenaje al legado de Senna. Gráfico del circuito de Interlagos en alta definición.',
                price: 52000,
                stock: 120,
                category: catIndumentaria._id,
                images: [
                    'https://fwncrqbostormzonvahn.supabase.co/storage/v1/object/public/imagenes/ayrton-senna-legacy-f1-sao-paulo-circuit-graphic-t-shirt-unisex_ss5_p-202461405+pv-1+u-efjtbofzvjqxytzumnvp+v-afsu6nu8jk0tyts9bff6.jpg.avif',
                    'https://fwncrqbostormzonvahn.supabase.co/storage/v1/object/public/imagenes/ayrton-senna-legacy-f1-sao-paulo-circuit-graphic-t-shirt-unisex_ss5_p-202461405+pv-2+u-efjtbofzvjqxytzumnvp+v-bume71f9a4tsrhxnfscz.jpg.avif',
                    'https://fwncrqbostormzonvahn.supabase.co/storage/v1/object/public/imagenes/ayrton-senna-legacy-f1-sao-paulo-circuit-graphic-t-shirt-unisex_ss5_p-202461405+pv-3+u-efjtbofzvjqxytzumnvp+v-ctjjeyhirktxmbupwreo.jpg.avif'
                ]
            },
            {
                name: 'Gorra Mercedes-AMG Petronas Adidas 2026',
                description: 'Gorra oficial del equipo Mercedes para la temporada 2026. Tecnología Aeroready de Adidas para máxima transpirabilidad.',
                price: 38000,
                stock: 200,
                category: catAccesorios._id,
                images: [
                    'https://fwncrqbostormzonvahn.supabase.co/storage/v1/object/public/imagenes/mercedes-amg-petronas-adidas-f1-2026-team-cap-black_ss5_p-203336926+pv-1+u-thbiobw9vdd341ujsggu+v-7whz9ymouokkbk6igdtj.png.avif',
                    'https://fwncrqbostormzonvahn.supabase.co/storage/v1/object/public/imagenes/mercedes-amg-petronas-adidas-f1-2026-team-cap-black_ss5_p-203336926+pv-2+u-thbiobw9vdd341ujsggu+v-mhs1odnrobpjgwgxwhiq.png.avif',
                    'https://fwncrqbostormzonvahn.supabase.co/storage/v1/object/public/imagenes/mercedes-amg-petronas-adidas-f1-2026-team-cap-black_ss5_p-203336926+pv-3+u-thbiobw9vdd341ujsggu+v-zdlzcmdxra1bd0zwgyn2.png.avif',
                    'https://fwncrqbostormzonvahn.supabase.co/storage/v1/object/public/imagenes/mercedes-amg-petronas-adidas-f1-2026-team-cap-black_ss5_p-203336926+pv-4+u-thbiobw9vdd341ujsggu+v-xestvsqcc7mwh4t2tw5v.png.avif'
                ]
            },
            {
                name: 'Hoodie Mercedes-AMG Kids 2026',
                description: 'Buzo oficial para los más jóvenes fans de las flechas de plata. Material ultra suave y logos bordados.',
                price: 85000,
                stock: 60,
                category: catIndumentaria._id,
                images: [
                    'https://fwncrqbostormzonvahn.supabase.co/storage/v1/object/public/imagenes/mercedes-amg-petronas-adidas-f1-2026-team-hoodie-black-kids_ss5_p-203336930+pv-1+u-cf2b6obpfc0yrzambsaw+v-txvhnlie3sz6ebsseuwy.jpg.avif',
                    'https://fwncrqbostormzonvahn.supabase.co/storage/v1/object/public/imagenes/mercedes-amg-petronas-adidas-f1-2026-team-hoodie-black-kids_ss5_p-203336930+pv-2+u-cf2b6obpfc0yrzambsaw+v-sms67z9pz9a5a5zq8yl1.png.avif',
                    'https://fwncrqbostormzonvahn.supabase.co/storage/v1/object/public/imagenes/mercedes-amg-petronas-adidas-f1-2026-team-hoodie-black-kids_ss5_p-203336930+pv-3+u-cf2b6obpfc0yrzambsaw+v-ott2moouow7trkm0ityi.png.avif',
                    'https://fwncrqbostormzonvahn.supabase.co/storage/v1/object/public/imagenes/mercedes-amg-petronas-adidas-f1-2026-team-hoodie-black-kids_ss5_p-203336930+pv-4+u-cf2b6obpfc0yrzambsaw+v-p9pzxjmweswz2rkzw6ar.png.avif',
                    'https://fwncrqbostormzonvahn.supabase.co/storage/v1/object/public/imagenes/mercedes-amg-petronas-adidas-f1-2026-team-hoodie-black-kids_ss5_p-203336930+pv-6+u-cf2b6obpfc0yrzambsaw+v-ti83iub2bzvdbfywokk2.png.avif'
                ]
            },
            {
                name: 'Zapatillas Mercedes Powerhouse Trainer',
                description: 'Calzado premium de Adidas diseñado para el equipo Mercedes-AMG Petronas. Comodidad y estilo para el día a día.',
                price: 185000,
                stock: 35,
                category: catIndumentaria._id,
                images: [
                    'https://fwncrqbostormzonvahn.supabase.co/storage/v1/object/public/imagenes/mercedes-amg-petronas-adidas-powerhouse-trainer_ss5_p-203336965+pv-1+u-v86efzzh0jojy651iqmk+v-b9besvszihewaplqypjj.png.avif',
                    'https://fwncrqbostormzonvahn.supabase.co/storage/v1/object/public/imagenes/mercedes-amg-petronas-adidas-powerhouse-trainer_ss5_p-203336965+pv-2+u-v86efzzh0jojy651iqmk+v-xdc72dpuevfb3g5yg2ua.png.avif',
                    'https://fwncrqbostormzonvahn.supabase.co/storage/v1/object/public/imagenes/mercedes-amg-petronas-adidas-powerhouse-trainer_ss5_p-203336965+pv-3+u-v86efzzh0jojy651iqmk+v-pxemohel0akmqrir3hhp.png.avif',
                    'https://fwncrqbostormzonvahn.supabase.co/storage/v1/object/public/imagenes/mercedes-amg-petronas-adidas-powerhouse-trainer_ss5_p-203336965+pv-4+u-v86efzzh0jojy651iqmk+v-q9w8lzge0ieonoyoocyj.png.avif',
                    'https://fwncrqbostormzonvahn.supabase.co/storage/v1/object/public/imagenes/mercedes-amg-petronas-adidas-powerhouse-trainer_ss5_p-203336965+pv-5+u-v86efzzh0jojy651iqmk+v-o59wzq2wdzscyzhktxsq.png.avif',
                    'https://fwncrqbostormzonvahn.supabase.co/storage/v1/object/public/imagenes/mercedes-amg-petronas-adidas-powerhouse-trainer_ss5_p-203336965+pv-6+u-v86efzzh0jojy651iqmk+v-i8pwfrhhv8yu2qikl8ih.png.avif',
                    'https://fwncrqbostormzonvahn.supabase.co/storage/v1/object/public/imagenes/mercedes-amg-petronas-adidas-powerhouse-trainer_ss5_p-203336965+pv-7+u-v86efzzh0jojy651iqmk+v-gslilrjjvaqyt0nqq6ck.png.avif'
                ]
            },
            {
                name: 'Chomba Scuderia Ferrari Official 2026',
                description: 'La chomba oficial del equipo de Maranello. Rojo Ferrari icónico con sponsor de HP bordado en las mangas.',
                price: 92000,
                stock: 75,
                category: catIndumentaria._id,
                images: [
                    'https://fwncrqbostormzonvahn.supabase.co/storage/v1/object/public/imagenes/scuderia-ferrari-2026-team-polo_ss5_p-203337053+pv-1+u-cpuue5qyocyqftvfrovq+v-ii2zxapdy1kmvr009q4e.jpg.avif',
                    'https://fwncrqbostormzonvahn.supabase.co/storage/v1/object/public/imagenes/scuderia-ferrari-2026-team-polo_ss5_p-203337053+pv-2+u-cpuue5qyocyqftvfrovq+v-gm6cs1ckxswtnlifo5nv.jpg',
                    'https://fwncrqbostormzonvahn.supabase.co/storage/v1/object/public/imagenes/scuderia-ferrari-2026-team-polo_ss5_p-203337053+pv-3+u-cpuue5qyocyqftvfrovq+v-kn9qe2iv2oxmvt5tjf03.jpg.avif'
                ]
            },
            {
                name: 'Campera Racing Scuderia Ferrari HP 2026',
                description: 'La pieza definitiva de la colección. Campera de competición acolchada con los colores oficiales de 2026.',
                price: 195000,
                stock: 25,
                category: catIndumentaria._id,
                images: [
                    'https://fwncrqbostormzonvahn.supabase.co/storage/v1/object/public/imagenes/scuderia-ferrari-2026-team-racing-jacket_ss5_p-203337047+pv-1+u-xa85wrgged3znsa4pojs+v-jhzrvo8w7xeaieh30ofr.jpg',
                    'https://fwncrqbostormzonvahn.supabase.co/storage/v1/object/public/imagenes/scuderia-ferrari-2026-team-racing-jacket_ss5_p-203337047+pv-2+u-xa85wrgged3znsa4pojs+v-xn0gst5foqpyifxpqor9.jpg.avif',
                    'https://fwncrqbostormzonvahn.supabase.co/storage/v1/object/public/imagenes/scuderia-ferrari-2026-team-racing-jacket_ss5_p-203337047+pv-3+u-xa85wrgged3znsa4pojs+v-kgjcywws6ccen8mo20gl.jpg.avif'
                ]
            }
        ];

        await Product.insertMany(productsParams);
        console.log(`Base de datos cargada correctamente con ${productsParams.length} productos, 3 categorías y 1 administrador.`);

        process.exit(0);

    } catch (error) {
        console.error("Error al cargar la base de datos:", error);
        process.exit(1);
    }
};

seedDatabase();
