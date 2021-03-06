/**
 * LibroItem
 * Modelo de datos de libro
 */
var LibroItem = Backbone.Model.extend({

	defaults: { id:0, img: '', titulo: '', autor:'', editorial:'', descripcion:''},
	urlRoot: "data/libros",

	parse : function(response)
	{
		//en caso de que el server nos pase un array,
		//tomamos el 1er elemento
		if($.isArray(response))
			return response[0];

		return response;
	}
});

/**
 * LibroList 
 * Collection de LibroItem
 */
var LibroList = Backbone.Collection.extend({
	model: LibroItem,
	url: "data/libros.json",
	sortOrder: "asc",
	sortField: "titulo",

	comparator: function (libro1, libro2)
	{
		if(this.sortOrder === "asc")
		{
			return libro1.get(this.sortField) > libro2.get(this.sortField);

		}else //this.sortOder === "desc"
		{
			return libro1.get(this.sortField) < libro2.get(this.sortField);
		}
	},

	search: function(letters)
	{
		if(letters === "") return this;

		//filtramos por regexp, i flag para ignore case (no distinguir lowercase/uppercase)
		var pattern = new RegExp(letters,'i');

		//iteramos la coll
		var filteredList = this.filter(function(data)
		{
			return (pattern.test( data.get('autor') + "  "+data.get('titulo') ));
			//podríamos filtrar por editorial también
			//return ( pattern.test(data.get('autor')) || pattern.test(data.get('titulo')) );// || pattern.test(data.get('editorial')) );
		});

		//create new coll con los elementos filtrados
		var coll = new LibroList(filteredList);

		return coll;

	}

});