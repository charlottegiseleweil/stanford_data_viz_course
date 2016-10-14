var hist = function(data_in, chart_id, value, chart_title) {

    var margin = {
            "top": 30,
            "right": 30,
            "bottom": 50,
            "left": 30
        },
        width = 600 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .domain([0, 1])
        .range([0, width]);

    var y = d3.scale.linear()
        .domain([0, d3.max(data_in, function(d) {
            return d.value[value];
        })])
        .range([height, 0]);

    d3.select("#" + chart_id).remove();

    var div = d3.select("#appearances_by_quantiles_container").append("div").attr("id", chart_id);

    div.append("h2").text(chart_title);

    var svg = div.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var bar = svg.selectAll(".bar")
        .data(data_in)
        .enter()
        .append("g")
        .attr("class", "bar")
        .attr("transform", function(d, i) {
            return "translate(" + x(i / data_in.length) + "," + y(d.value[value]) + ")";
        });

    bar.append("rect")
        .attr("x", 1)
        .attr("width", width / data_in.length - 1)
        .attr("height", function(d) {
            return height - y(d.value[value]);
        });

    var formatCount = d3.format(",.0f");

    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", 6)
        .attr("x", (width / data_in.length - 1) / 2)
        .attr("text-anchor", "middle")
        .text(function(d) {
            return formatCount(d.value.count);
        });

    var unique_names = data_in.map(function(d) {
        return d.key;
    });

    var xScale = d3.scale.ordinal().domain(unique_names).rangePoints([0, width]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    var xTicks = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("font-size", 10)
        .attr("transform", function(d) {
            return "rotate(-50)"
        });


    var yAxis = d3.svg.axis()
        .ticks(5)
        .scale(y)
        .orient("left");

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0,0)")
        .call(yAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("font-size", 10);
}


d3.json(fuels_dataset,
    function(error, fuels_dataset) {

        /* Crossfilter constructor*/
        var cf = crossfilter(fuels_dataset);

        /*Dimensions (=columns of interest*/
        var dim_input1 = cf.dimension(function(d) {
            return d.Cellulosic_cost;
        });
        var dim_input2 = cf.dimension(function(d) {
            return d.Tot_Biomass;
        });
        var dim_input3 = cf.dimension(function(d) {
            return d.Feedstock_dist;
        });
        var dim_input4 = cf.dimension(function(d) {
            return d.Cellulosic_yield;
        });
        var dim_input5 = cf.dimension(function(d) {
            return d.Oil_elasticity;
        });
        var dim_input6 = cf.dimension(function(d) {
            return d.Demand_elasticity;
        });
        var dim_input7 = cf.dimension(function(d) {
            return d.Electricity_coproduction;
        });
        var dim_input8 = cf.dimension(function(d) {
            return d.oil_supply_shift;
        });
        var dim_input9 = cf.dimension(function(d) {
            return d.Biomass_bckstop_price;
        });

        var dim_output = cf.dimension(function(d) {
            return d.Expen_change;
        });

        var dim_quant1 = cf.dimension(function(d) {
            return d.Quant1;
        });
        var dim_quant2 = cf.dimension(function(d) {
            return d.Quant2;
        });
        var dim_quant3 = cf.dimension(function(d) {
            return d.Quant3;
        });
        var dim_quant4 = cf.dimension(function(d) {
            return d.Quant4;
        });
        var dim_quant5 = cf.dimension(function(d) {
            return d.Quant5;
        });
        var dim_quant6 = cf.dimension(function(d) {
            return d.Quant6;
        });
        var dim_quant7 = cf.dimension(function(d) {
            return d.Quant7;
        });
        var dim_quant8 = cf.dimension(function(d) {
            return d.Quant8;
        });
        var dim_quant9 = cf.dimension(function(d) {
            return d.Quant9;
        });
        var dim_quant10 = cf.dimension(function(d) {
            return d.Quant10;
        });

        console.log(dim_input4.top(2));
        console.log(dim_input9.bottom(2));
        console.log(dim_input8.top(Infinity));

        /*Grouping */
        var group_1 = dim_quant1.group();
        var group_2 = dim_quant2.group();
        var group_3 = dim_quant3.group();
        var group_4 = dim_quant4.group();
        var group_5 = dim_quant5.group();
        var group_6 = dim_quant6.group();
        var group_7 = dim_quant7.group();
        var group_8 = dim_quant8.group();
        var group_9 = dim_quant9.group();
        var group_10 = dim_quant10.group();



        /* 
            // sanity check
    
            group_team
              .top(Infinity)
              .forEach(function(d, i) {
                console.log(JSON.stringify(d));
              });
              
            */

        /* --------------------------------------------------------- 
    
              Add a third and 4th variable to this map reduction
              - the third should be the minimum year
              - the fourth should be the maximum year
              - hint: use inequalities
              
            */

        var reduce_init = function() {
            return {
                "count": 0,
                "total": 0
            };
        }

        var reduce_add = function(p, v, nf) {
            ++p.count;
            p.total += v.g_all;
            return p;
        }

        var reduce_remove = function(p, v, nf) {
            --p.count;
            p.total -= v.g_all;
            return p;
        }

        /* --------------------------------------------------------- NOT SURE I UNDERSTAND more complex reductions*/

        group_1.reduce(reduce_add, reduce_remove, reduce_init);
        group_2.reduce(reduce_add, reduce_remove, reduce_init);
        group_3.reduce(reduce_add, reduce_remove, reduce_init);
        group_4.reduce(reduce_add, reduce_remove, reduce_init);
        group_5.reduce(reduce_add, reduce_remove, reduce_init);
        group_6.reduce(reduce_add, reduce_remove, reduce_init);
        group_7.reduce(reduce_add, reduce_remove, reduce_init);
        group_8.reduce(reduce_add, reduce_remove, reduce_init);
        group_9.reduce(reduce_add, reduce_remove, reduce_init);
        group_10.reduce(reduce_add, reduce_remove, reduce_init);
      

        var render_plots = function() {
            // count refers to a specific key specified in reduce_init 
            // and updated in reduce_add and reduce_subtract
            // Modify this for the chart to plot the specified variable on the y-axis
            hist(group_1.top(Infinity),
                "appearances_by_quantiles",
                "count",
                "# of datapoints in this cost range"
            );

            /* build more charts here */

        }


        /* --------------------------------------------------------- 
           Sliders
        */
        var input1_slider = new Slider(
            "#input1_slider", {
                "id": "input1_slider",
                "min": 67,
                "max": 140,
                "range": true,
                "value": [67, 140]
            });
        var input2_slider = new Slider(
            "#input2_slider", {
                "id": "input2_slider",
                "min": 450,
                "max": 998,
                "range": true,
                "value": [450, 998]
            });
        var input3_slider = new Slider(
            "#input3_slider", {
                "id": "input3_slider",
                "min": 0,
                "max": 1,
                "range": true,
                "value": [0, 1]
            });
        var input4_slider = new Slider(
            "#input4_slider", {
                "id": "input4_slider",
                "min": 80,
                "max": 100,
                "range": true,
                "value": [80, 100]
            });
        var input5_slider = new Slider(
            "#input5_slider", {
                "id": "input5_slider",
                "min": 0.2,
                "max": 0.6,
                "range": true,
                "value": [0.2, 0.6]
            });
        var input6_slider = new Slider(
            "#input6_slider", {
                "id": "input6_slider",
                "min": -0.8,
                "max": -0.8,
                "range": true,
                "value": [-0.8, -0.8]
            });
        var input7_slider = new Slider(
            "#input7_slider", {
                "id": "input7_slider",
                "min": 0,
                "max": 2,
                "range": true,
                "value": [0, 2]
            });
        var input8_slider = new Slider(
            "#input8_slider", {
                "id": "input8_slider",
                "min": -0.2,
                "max": 0.1,
                "range": true,
                "value": [-0.2, 0.1]
            });
        var input9_slider = new Slider(
            "#input9_slider", {
                "id": "input9_slider",
                "min": 90,
                "max": 200,
                "range": true,
                "value": [90, 200]
            });


        // Event handlers for the sliders (?????) +  // filter based on the UI element ////////not sure I understand 

        input1_slider.on("slide", function(e) {
            d3.select("#input1_slider_txt").text("min: " + e[0] + ", max: " + e[1]);
            dim_input1.filter(e);
            // re-render
            render_plots();
            /* update the other charts here 
             hint: each one of your event handlers needs to update all of the charts
            */
        });
        input2_slider.on("slide", function(e2) {
            d3.select("#input2_slider_txt").text("min: " + e2[0] + ", max: " + e2[1]);
            dim_input2.filter(e2);
            // re-render
            render_plots();
            /* update the other charts here 
             hint: each one of your event handlers needs to update all of the charts
            */
        });
        input3_slider.on("slide", function(e3) {
            d3.select("#input3_slider_txt").text("min: " + e3[0] + ", max: " + e3[1]);
            dim_input3.filter(e3);
            // re-render
            render_plots();
            /* update the other charts here 
             hint: each one of your event handlers needs to update all of the charts
            */
        });
        input4_slider.on("slide", function(e4) {
            d3.select("#input4_slider_txt").text("min: " + e4[0] + ", max: " + e4[1]);
            dim_input4.filter(e4);
            // re-render
            render_plots();
            /* update the other charts here 
             hint: each one of your event handlers needs to update all of the charts
            */
        });
        input5_slider.on("slide", function(e5) {
            d3.select("#input5_slider_txt").text("min: " + e5[0] + ", max: " + e5[1]);
            dim_input5.filter(e5);
            // re-render
            render_plots();
            /* update the other charts here 
             hint: each one of your event handlers needs to update all of the charts
            */
        });
        input6_slider.on("slide", function(e6) {
            d3.select("#input6_slider_txt").text("min: " + e6[0] + ", max: " + e6[1]);
            dim_input6.filter(e6);
            // re-render
            render_plots();
            /* update the other charts here 
             hint: each one of your event handlers needs to update all of the charts
            */
        });
        input7_slider.on("slide", function(e7) {
            d3.select("#input7_slider_txt").text("min: " + e7[0] + ", max: " + e7[1]);
            dim_input7.filter(e7);
            // re-render
            render_plots();
            /* update the other charts here 
             hint: each one of your event handlers needs to update all of the charts
            */
        });
        input8_slider.on("slide", function(e8) {
            d3.select("#input8_slider_txt").text("min: " + e8[0] + ", max: " + e8[1]);
            dim_input8.filter(e8);
            // re-render
            render_plots();
            /* update the other charts here 
             hint: each one of your event handlers needs to update all of the charts
            */
        });
        input9_slider.on("slide", function(e9) {
            d3.select("#input9_slider_txt").text("min: " + e9[0] + ", max: " + e9[1]);
            dim_input9.filter(e9);
            // re-render
            render_plots();
            /* update the other charts here 
             hint: each one of your event handlers needs to update all of the charts
            */
        });






        /* add at least 3 more event handlers here */


        /* --------------------------------------------------------- */



        render_plots(); // this just renders the plots for the first time ????????????????????? why a second time ????

        console.log("Everything worked");
    });
