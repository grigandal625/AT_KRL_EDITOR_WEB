import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import { apiLocation } from "../../GLOBAL";
import { ThemedBar } from "../../utils/ThemedContainer";
import { useNavigate } from "react-router-dom";
const { Dragger } = Upload;

export default () => {
    const props = {
        name: "file",
        multiple: false,
        onChange(info) {
            const { status } = info.file;
            if (status !== "uploading") {
                console.log(info.file, info.fileList);
            }
            if (status === "done") {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === "error") {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log("Dropped files", e.dataTransfer.files);
        },
    };

    const navigate = useNavigate();

    const loadFile = async ({ onSuccess, onError, file }) => {
        const fmData = new FormData();
        fmData.append("file", file);
        try {
            const fetchResult = await fetch(`${apiLocation}/api/knowledge_bases/upload/`, {
                method: "post",
                body: fmData,
                // headers: {
                //     'Content-Disposition': `attachment; filename="${file.name}"`,
                // },
                mode: "cors",
                credentials: "same-origin",
            });
            if (fetchResult.status !== 200) {
                onError(fetchResult);
            } else {
                const response = await fetchResult.json();
                onSuccess(response);
                navigate(`/knowledge_bases/${response.knowledge_base}`);
            }
        } catch (e) {
            onError(e);
        }
    };

    return (
        <ThemedBar>
            <Dragger {...props} customRequest={loadFile}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Нажмите для выбора файла или перетащите файл базы знаний в эту область</p>
                <p className="ant-upload-hint">Поддерживается чтение файлов базы знаний в формате ЯПЗ (.kbs), xml и json</p>
            </Dragger>
        </ThemedBar>
    );
};
