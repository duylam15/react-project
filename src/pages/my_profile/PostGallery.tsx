import { useState } from "react";
import { Modal } from "antd";

type Props = {
	images: string[];
};

const PostGallery = ({ images }: Props) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	const handleImageClick = (img: string) => {
		setSelectedImage(img);
		setIsModalOpen(true);
	};

	return (
		<>
			<div className="grid grid-cols-3 gap-1 mt-6">
				{images.map((img, index) => (
					<div key={index} className="aspect-square h-[410px] w-[308px] cursor-pointer" onClick={() => handleImageClick(img)}>
						<img src={img} alt="Post" className="w-full h-full object-cover" />
					</div>
				))}
			</div>
			<Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
				{selectedImage && <img src={selectedImage} alt="Selected" className="w-full object-cover" />}
			</Modal>
		</>
	);
};

export default PostGallery;