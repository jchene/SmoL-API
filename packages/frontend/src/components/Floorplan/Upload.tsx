import axios from 'axios';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { client } from '../../main';
import { Button, Upload, UploadProps, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import TopBanner from '../subcomponents/banners/TopBanner';

const uploadFile = async (options: UploadRequestOption) => {
	try {
		const clientUrl = await client.signedUrl.query()
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

function UploadContainer() {

	const props: UploadProps = {
		customRequest: uploadFile,
		onChange(info) {
			if (info.file.status !== 'uploading')
				message.info(`uploading ${info.file.name}`)
			if (info.file.status === 'done')
				message.success(`${info.file.name} file uploaded successfully`);
			else if (info.file.status === 'error')
				message.error(`${info.file.name} file upload failed.`);
		},
	};
	return (
		<>
			<TopBanner content='Upload' />
			<div className='relative flex justify-center'>
				<Upload className='p-8' {...props}>
					<Button icon={<UploadOutlined />}>Click to Upload</Button>
				</Upload>
				<img src="https://jchene-first-sst-app-createb-assetsbucket5f3b285a-ke23l8et3h37.s3.eu-west-1.amazonaws.com/05c91e3b-1e5d-497d-91f5-c8375f742c2f"/>
			</div>
			
		</>
	)
}

export default UploadContainer