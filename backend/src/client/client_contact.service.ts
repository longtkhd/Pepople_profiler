import { Injectable, Logger } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';

import { InjectModel } from 'nestjs-typegoose';
import { JwtPayload } from 'src/auth/dto/login';
import {
    ClientContact,
    ClientContactTextSearch,
} from 'src/schemas/client.schema';
import { MapperService } from 'src/shared/mapper/mapper.service';
import { ClientContactDto, EditClientContactDto } from './dto/client';
import { PaginateOptions, FilterQuery, PaginateResult } from 'mongoose';

@Injectable()
export class ClientContactService {
    constructor(
        @InjectModel(ClientContact)
        private readonly repo: ReturnModelType<typeof ClientContact>,
        private readonly mapperService: MapperService,
    ) {
        //this.mapperService.createMap(ClientDetailDto.name, Client.name);
        //this.mapperService.createMap(ClientInfoDto.name, Client.name);
    }
    private readonly logger = new Logger(ClientContactService.name);
    async list(client_id: string): Promise<PaginateResult<ClientContact>> {
        const query: FilterQuery<ClientContact> = {
            client_id: new ObjectId(client_id),
            is_deleted: false,
        };
        const options: PaginateOptions = {};
        options.pagination = false;
        return this.repo.paginate(query, options);
    }

    async delete(user: JwtPayload, contact_id: string[]) {
        return await this.repo
            .update(
                {
                    _id: {
                        $in: contact_id.map((x) => new ObjectId(x)),
                    },
                },
                {
                    is_deleted: true,
                    updated_by: new ObjectId(user.id),
                },
            )
            .exec();
    }
    async create(
        user: JwtPayload,
        createContactDto: ClientContactDto,
        client_id: string,
    ): Promise<ClientContact | null> {
        try {
            const newContact = new this.repo();
            newContact.email = createContactDto.email;
            newContact.contract_number = createContactDto.contact_number;
            newContact.first_name = createContactDto.first_name;
            newContact.last_name = createContactDto.last_name;
            newContact.client_id = new ObjectId(client_id);
            newContact.created_by = new ObjectId(user.id);

            const savedObj = await newContact.save();
            if (savedObj) {
                newContact.id = savedObj.id;
                return newContact;
            }
            return null;
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }
    async update(
        user: JwtPayload,
        editContactDto: EditClientContactDto,
        client_id: string,
    ): Promise<ClientContact | null> {
        try {
            const text_search = this.createSearchText({ ...editContactDto });
            return await this.repo
                .update(
                    {
                        _id: new ObjectId(editContactDto.id),
                        client_id: new ObjectId(client_id),
                    },
                    {
                        ...editContactDto,
                        updated_by: new ObjectId(user.id),
                        text_search: text_search,
                    },
                )
                .exec();
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }
    createSearchText(contact: ClientContactTextSearch) {
        try {
            return `${contact.first_name} ${contact.last_name} ${contact.email} `;
        } catch (error) {
            this.logger.error('unable to build text search for ClientContact');
            this.logger.error(error);
        }
    }
    async findClientContact(client_contact_id: string): Promise<ClientContact> {
        const client = await this.repo.findOne({ _id: client_contact_id });
        return client;
    }
}
