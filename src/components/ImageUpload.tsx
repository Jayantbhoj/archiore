import { useDropzone } from 'react-dropzone';
import { useState } from 'react';

const ImageUpload = ({ onUpload }: { onUpload: (imageUrl: string) => void }) => {
    const [error, setError] = useState<string | null>(null);

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': []
        },
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    onUpload(reader.result as string);
                };
                reader.readAsDataURL(file);
            }
        },
    });

    return (
        <div {...getRootProps()} className="border-2 border-dashed p-4 rounded-lg text-center cursor-pointer">
            <input {...getInputProps()} />
            <p>Drag & drop an image here, or click to select one</p>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default ImageUpload;
