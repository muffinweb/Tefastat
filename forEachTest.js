let data = [
    {
        id: 1,
        name: 'Ugur'
    },
    {
        id: 2,
        name: 'Necati'
    }
];

data.forEach(function(person){
    person.name = person.name.toUpperCase();
})

console.log(data);