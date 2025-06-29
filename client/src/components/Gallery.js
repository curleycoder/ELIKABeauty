import React, {useState} from 'react';


const galleryImages =[
    "/gallery1.jpg",
    "/gallery2.jpg",
    "/gallery3.jpg",
    "/gallery4.jpg",
    "/gallery5.jpg",
    "/gallery6.jpg"
]


export default function Gallery(){
    const [selectedImage, setSelectedImage ] = useState(galleryImages[0]);
    return(
        <section className='text-center px-4 py-10'>
            <h2 className='text-3xl font-bodonimoda text-[#55203d] mb-6'>
            <span className='border-t border-b border-gray-300 px-6'> Photo Gallery </span>
            </h2>

            <div className="flex justify-center mb-6">
            <img
            src={selectedImage}
            alt="Selected"
            className="max-h-[500px] w-auto rounded-xl shadow-lg object-cover"
            />
        </div>


        <div className="flex overflow-x-auto space-x-3 px-4 scrollbar-hide">
            {galleryImages.map((img, idx) => (
            <img
                key={idx}
                src={img}
                alt={`Gallery ${idx}`}
                onClick={() => setSelectedImage(img)}
                className={`h-20 w-20 object-cover rounded cursor-pointer border-2 ${
                selectedImage === img ? 'border-purplecolor' : 'border-transparent'
                }`}
            />
            ))}
        </div>
        </section>
    )
}