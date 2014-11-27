module.exports = {
    address: faker.address.streetAddress(),
    avatar: faker.internet.avatar(),
    city: faker.address.city(),
    companyId: 1,
    companyName: faker.company.companyName(),
    country: faker.address.country(),
    createdAt: faker.date.past(),
    email: faker.internet.email(),
    fb: null,
    firstName: faker.name.firstName(),
    id: 1,
    lastName: faker.name.lastName(),
    postCode: faker.address.zipCode(),
    instancesAcl: {
        1: 'admin',
        2: 'viewer'
    },
    updatedAt: faker.date.recent()
}