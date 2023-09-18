import PokemonButton from '../subcomponents/buttons/PokemonButton';
import NavButton from '../subcomponents/buttons/NavButton';
import TopBanner from '../subcomponents/banners/TopBanner';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload, UploadProps } from 'antd';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import axios from 'axios';
import { client } from '../../main';

const handleCustomRequest = async (options: UploadRequestOption) => {
	try {
		const clientUrl = await client.signedUrl.query();
		console.log('Presigned url:', clientUrl)
		if (clientUrl) {
			await axios
				.put(clientUrl.url, options.file.slice(), {
					headers: { 'Content-Type': 'image/*' },
				})
				.then(async () => {
					message.success('Successfully uploaded');
				})
				.catch((e) => {
					message.success('Failed to upload: ', e);
				});
		}
	}
	catch (e) {
		console.log("Couldn't upload file:", e)
	}
};

const props: UploadProps = {
	customRequest: handleCustomRequest,
	onChange(info) {
		if (info.file.status !== 'uploading') {
			console.log(info.file, info.fileList);
		}
		if (info.file.status === 'done') {
			message.success(`${info.file.name} file uploaded successfully`);
		} else if (info.file.status === 'error') {
			message.error(`${info.file.name} file upload failed.`);
		}
	},
};

function Floorplan() {
	return (
		<>
			<TopBanner content='Floorplan' />
			<div className="relative flex justify-center">
				<NavButton content='Home' destination='/' />
			</div>
			<Upload {...props}>
				<Button icon={<UploadOutlined />}>Click to Upload</Button>
			</Upload>
			<PokemonButton destination='/pokemon' />
		</>
	)
}

export default Floorplan