import axios from 'axios';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { client } from '../../main';
import { Button, Upload, UploadProps, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

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
			<div className='relative flex justify-center'>
				<Upload className='p-8' {...props}>
					<Button icon={<UploadOutlined />}>Click to Upload</Button>
				</Upload>
			</div>
			
		</>
	)
}

export default UploadContainer