import mongoose, { isValidObjectId } from 'mongoose'
import { Video } from '../models/video.model.js'
import { User } from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'

const getAllVideos = asyncHandler(async (req, res) => {
  //TODO: get all videos based on query, sort, pagination
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query

  

})

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body
  const videoLocalPath = req.files?.videoFile[0]?.path
  const videoThumbnailLocalPath = req.files?.thumbnail[0]?.path  
  const user_id = req.user?._id

  // Uploading video on Cloudinary

  if (!videoLocalPath) throw new ApiError(400, 'Please add a video')  
  
  const videoResponse = await uploadOnCloudinary(videoLocalPath)
  
  if (!videoResponse) throw new ApiError(500, 'Failed to upload video')
  
  // Uploading thumbnail on cloudinary

  if (!videoThumbnailLocalPath) throw new ApiError(400, 'Please add a thumbnail')

  const thumbnailResponse = await uploadOnCloudinary(videoThumbnailLocalPath)

  if (!thumbnailResponse) throw new ApiError(500, 'Failed to upload thumbnail')

  // Adding video info to the database

  const video = await Video.create({
    videoFile: {
      url: videoResponse?.url,
      public_id: videoResponse?.public_id,
    },
    thumbnail: {
      url: thumbnailResponse?.url,
      public_id: thumbnailResponse?.public_id,
    },
    title: title,
    description: description,
    duration: videoResponse?.duration.toFixed(2) || 0,
    views: 0,
    isPublished: true,
    owner: user_id,
  })

  return res
    .status(200)
    .json(new ApiResponse(
      200,
      video,
      'Video upload successfully'
    ))
})

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params
  //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params
  //TODO: update video details like title, description, thumbnail
})

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params
  //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params
})

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
}
