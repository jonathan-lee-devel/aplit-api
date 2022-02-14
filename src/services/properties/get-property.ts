import {StatusContainerDto} from '../../dto/StatusContainerDto';
import {PropertyDto} from '../../dto/PropertyDto';
import {User} from '../../models/User';
import {PropertyModel} from '../../models/properties/Property';

export const getProperty = async (
    user: User, id: string,
): Promise<StatusContainerDto<PropertyDto>> => {
  const property = await PropertyModel.findOne({id: id},
      {
        _id: 0,
        __v: 0,
      });

  if (!property) {
    return {
      status: 404,
      data: undefined,
    };
  }

  if (property.tenants.includes(user.email) ||
      property.admin.email === user.email) {
    return {
      status: 200,
      data: property,
    };
  } else {
    return {
      status: 403,
      data: undefined,
    };
  }
};
