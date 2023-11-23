import { Button, Upload, UploadProps, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React from 'react';

interface UploadContainerProps {
	floorplanPresignedUrl: string;
	deskPresignedUrl: string;
}

const UploadContainer: React.FC<UploadContainerProps> = ({
	floorplanPresignedUrl,
	deskPresignedUrl,
}) => {
	const beforeUpload = (file: File) => {
		const isPNG = file.type === 'image/png';
		if (!isPNG) {
			message.error(`${file.name} is not a png file`);
		}
		return isPNG || Upload.LIST_IGNORE;
	}
	const onChange = (info: any) => {
		if (info.file.status !== 'uploading') {
			console.log(info.file, info.fileList);
		}
		if (info.file.status === 'done') {
			message.success(`${info.file.name} file uploaded successfully`);
		} else if (info.file.status === 'error') {
			message.error(`${info.file.name} file upload failed.`);
		}
	}
	const getProp = (type: 'desk' | 'floorplan'): UploadProps => {
		return {
			method: 'PUT',
			action: type === 'desk' ? deskPresignedUrl : floorplanPresignedUrl,
			headers: { 'content-type': 'image/png' },
			beforeUpload: beforeUpload,
			onChange: onChange,
		};
	}
	const fpProps = getProp('floorplan');
	const dProps = getProp('desk');
	return (
		<>
			<div className='relative flex justify-center'>
				<Upload className='p-8' {...fpProps}>
					<Button icon={<UploadOutlined />}>Floorplan</Button>
				</Upload>
				<Upload className='p-8' {...dProps}>
					<Button icon={<UploadOutlined />}>Desk</Button>
				</Upload>
			</div>

		</>
	)
}

export default UploadContainer