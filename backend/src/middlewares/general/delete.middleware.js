
const deleteData = async(model,loginId,dataId)=> {
  try {
        //validate manager
        if (!loginId) {
            throw new apiError({
                statusCode: 400,
                message: "id is invalid"
            })
        };

        const post = await model.findById(dataId);
        if (!dataId) {
            throw new apiError({
                statusCode: 404,
                message: "invalid post id"
            })
        };  
        //validate state
        if (post.state !== "approved" && post.state !== "reject") {
            throw new apiError({
              statusCode: 400,
              message: "Post cannot be deleted. Only posts with state 'approved' or 'reject' can be deleted.",
            });
          }
          await model.findByIdAndDelete(dataId);
    } catch (error) {
        throw error
    }
}

export { deleteData }