export const paginate = async (model, query, page = 1, limit = 10) => {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const startIndex = (pageNumber - 1) * limitNumber;

    const totalDocuments = await model.countDocuments(query);
    const results = await model.find(query).skip(startIndex).limit(limitNumber);

    const totalPages = Math.ceil(totalDocuments / limitNumber);

    const pagination = {
        totalDocuments,
        currentPage: pageNumber,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1,
        limit: limitNumber
    };

    return { results, pagination };
};
