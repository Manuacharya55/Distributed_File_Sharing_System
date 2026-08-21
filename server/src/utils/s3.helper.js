import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { awsS3Bucket } from "../config/aws.js";

const DEFAULT_UPLOAD_EXPIRY = 15 * 60; // 15 minutes
const DEFAULT_DOWNLOAD_EXPIRY = 60 * 60; // 1 hour

/**
 * Generates a presigned PUT URL for direct client-to-S3 upload
 */
export const getPresignedUploadUrl = async (key, mimeType, expiresIn = DEFAULT_UPLOAD_EXPIRY) => {

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        ContentType: mimeType,
    });

    const url = await getSignedUrl(awsS3Bucket, command, { 
        expiresIn,
        unhoistableHeaders: new Set(["x-amz-checksum-crc32", "x-amz-sdk-checksum-algorithm", "x-amz-checksum-sha256"]),
    });
    return { url, key };
};

/**
 * Generates a presigned GET URL for viewing or downloading private S3 objects
 */

export const getPresignedGetUrl = async (key, originalName = null, isDownload = false, expiresIn = DEFAULT_DOWNLOAD_EXPIRY) => {
    const commandParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
    };

    if (originalName) {
        const disposition = isDownload ? "attachment" : "inline";
        
        commandParams.ResponseContentDisposition = `${disposition}; filename="${encodeURIComponent(originalName)}"`;
    }

    const command = new GetObjectCommand(commandParams);
    const url = await getSignedUrl(awsS3Bucket, command, { expiresIn });
    return url;
};

/**
 * Deletes a single object from S3
 */
export const deleteS3Object = async (key) => {
    if (!key) return;
    const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
    });
    return await awsS3Bucket.send(command);
};

/**
 * Deletes multiple objects from S3 in batch
 */
export const deleteS3ObjectsBatch = async (keys = []) => {
    if (!keys || keys.length === 0) return;
    
    // AWS S3 DeleteObjects accepts at most 1000 keys per call
    const chunkSize = 1000;
    for (let i = 0; i < keys.length; i += chunkSize) {
        const chunk = keys.slice(i, i + chunkSize).map(k => ({ Key: k }));
        const command = new DeleteObjectsCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Delete: {
                Objects: chunk,
                Quiet: true,
            },
        });
        await awsS3Bucket.send(command);
    }
};
