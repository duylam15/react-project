import { Carousel } from "antd";

const ImageCarousel = ({ mediaList }: { mediaList: any[] }) => {
	return (
		<Carousel infinite={false} arrows className="ant-custom">
			{mediaList.map((media) => (
				<img
					key={media.id}
					src={media.media}
					alt=""
					className="w-full h-[585px] object-cover rounded-lg"
				/>
			))}
		</Carousel>
	);
};

export default ImageCarousel;