var blockly = {
		URL:{
			resultUrl:function(){
				return "http://120.76.41.101:8080/SpringBoot/findFieldsWithObjList";
			}
		},
		/**
		 * 初始化模态框
		 */
		initBlockly:function(){
			var stockCategory = document.getElementById("stock");
			var strategyCategory = document.getElementById("strategy");
			var strategy = [];
			var stock = [];
			var mylist = [];
			var add = function(item){
				var name = item.tablename;
				mylist.push(name);
				Blockly.Blocks[name] = {
					init: function(){
						this.setColour(1);
						this.appendDummyInput()
							.appendField(new Blockly.FieldDropdown([["+", "+"], ["-", "-"], ["*", "*"], ["/", "/"]]), "OPERATOR")
							.appendField(name,"TABLE")//new Blockly.FieldDropdown([[item.name,name]])
							.appendField(new Blockly.FieldDropdown(field(item)), "FIELD");
						this.setPreviousStatement(true, null);
						this.setNextStatement(true, null);
						this.setTooltip('');
						this.setHelpUrl('http://www.example.com/');
					}
				};
				Blockly.JavaScript[name] = function(block){
					var operator = block.getFieldValue("OPERATOR");
					var table = block.getFieldValue("TABLE");
					var field = block.getFieldValue("FIELD");
					var str = [operator,[table,field].join(".")].join("");
					return str;
				}
			}
			
			var field = function(item){
				var fieldArr = [];
				var fields = item.fields;
				for (var i = 0; i < fields.length; i++) {
					var type = fields[i].type;
					if(type=="INT" || type=="NUMERIC"){
						var efield = fields[i].fields;
						var cfield = fields[i].name;
						var field = [cfield,efield];
						fieldArr.push(field);
					}
				}
				return fieldArr;
			}
			$.ajax({
				type:"GET",
				url:'/common/result.json',
				datatype:"json",
				async:false,
				success:function(data){
					for(var i = 0 ;i < data.length;i++){
						var table = data[i];
						var tableFields = table.fields;
						for ( var fields in tableFields) {
							//debugger;
							var field = tableFields[fields];
							if(field.fields == "RPT_DATE"){
								stock.push("<block type='"+table.tablename+"'></block>")
								add(table);
							}
						}
					}
				},error:function(err){
					alert("请求异常:"+err);
				}
			})
			
			Blockly.Blocks['limit'] = {
			  init: function() {
				this.setColour(160);
			    this.appendDummyInput()
			        .appendField("limit")
			        .appendField(new Blockly.FieldAngle(10), "LIMIT");
			    this.setPreviousStatement(true, null);
			    this.setTooltip('');
			    this.setHelpUrl('http://www.example.com/');
			  }
			};
			Blockly.JavaScript['limit'] = function(block){
				var limit = ":"+block.getFieldValue("LIMIT");
				return limit;
			}
			Blockly.Blocks['block_type'] = {
					  init: function() {
						this.setColour(100);
					    this.appendStatementInput("NAME")
					        .setCheck(null)
					        .appendField("财务");
					    this.setPreviousStatement(true, null);
					    this.setNextStatement(true, null);
					    this.setHelpUrl('http://www.example.com/');
					    this.setMutator(new Blockly.Mutator(["controls_if_elseif", "controls_if_else"]));
					    this.setTooltip('');
					  }
			};
			Blockly.JavaScript["block_type"]=function a(a) {
				var c = Blockly.JavaScript.statementToCode(a, 'NAME');
				return c;
			};
			Blockly.Blocks['DKBF'] = {
			  init: function() {
			    this.appendDummyInput()
			        .appendField("DKBF");
			    this.setPreviousStatement(true, null);
			    this.setTooltip('');
			    this.setHelpUrl('http://www.example.com/');
			  }
			};
			Blockly.JavaScript['DKBF'] = function(block) {
			  return 'DKBF';
			}; 
			stock.push("<block type='block_type'></block>");
			stock.push("<block type='limit'></block>")
			stockCategory.innerHTML = stock.join("");
			strategy.push("<block type='DKBF'></block>");
			strategyCategory.innerHTML = strategy.join("");
			
		},
		/**
		 * 模态框居中的控制
		 */
		centerModals:function(){
			$('.modal').each(function(i){   //遍历每一个模态框
				var $clone = $(this).clone().css('display', 'block').appendTo('body'); 
				var height = window.screen.availHeight/6;   //屏幕可用工作区高度
				var scrollTop = window.parent.document.documentElement.scrollTop;
				if(scrollTop==0) 
				{
					scrollTop = window.parent.document.body.scrollTop;
				}
				//var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
				top = top > 0 ? top : 0;
				$clone.remove();
				$(this).find('.modal-content').css("margin-top", scrollTop+height);  //修正原先已经有的30个像素
			});
		},
		/**
		 * 弹出模态框，返回数据
		 */
		findOperationResult:function(code){
			$("#modal-body").html("<img src='images/20140928103818165.gif'/>");
			var tbody = [];
			$.get(blockly.URL.resultUrl(),{"param":code},function(data){
				$("#modal-body").html("");
				var array = eval(data);
				for (var i = 0; i < array.length; i++) {
					var stk = array[i];
					
					var STOCKSNAME = stk.STOCKSNAME;
					var STOCKCODE = stk.STOCKCODE;
					var TRADE_MKT = stk.TRADE_MKT;
					var COMCODE = stk.COMCODE;
					var operationResult = stk.operationResult;
					var tr = "<tr><td>"+STOCKSNAME+"</td><td>"+STOCKCODE+"</td><td>"+TRADE_MKT+"</td><td>"+COMCODE+"</td><td>"+operationResult+"</td></tr>"
					tbody.push(tr);
					//$("#modal-body").append(p);
				}
				var table = "<table class='table table-striped table-hover'>"+
							"<thead><tr><th>股票简称</th><th>证券代码</th><th>交易市场</th><th>公司代码</th><th>运算结果</th></tr></thead>"+
							tbody.join("")+
							"</table>";
				$("#modal-body").html(table);
			});
		}
}

