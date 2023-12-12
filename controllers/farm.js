import { getFarmByUserID } from "./../services/farm";

export const getFarmsByUser = async (req, res, next) => {
  try {
    const farms = await getFarmByUserID(req.userInfo);
    return res.status(200).json(farms);
  } catch (error) {
    return next(new AppError("Internal error sever", 500));
  }
};
