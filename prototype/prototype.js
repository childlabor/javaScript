window.onload = function(){

	// 外部调用函数内部方法函数   函数表达式
	
	//======= 1.1私有变量  构造函数模式       new实例 继承原型
	function Animal_1(){
		console.log("开始执行_1 构造函数模式");
		console.log(this);
  	var name = "Animal_1";  
  	// 特权方法（有权访问私有变量和私有函数）
  	// this创建方法不如定义在原型prototype上效率高，因为每次实例都会对this（此时指向实例）创建方法
 		this.showName = function(){  
 			console.log(this);
      console.log(name); 	    
    }
 		this.sayHi = function(){ 
   		console.log("hi_1");
   	};
		// 给构造器添加新方法 （优选）
		Animal_1.prototype.newMethod = function(){
	 		console.log("原型添加的新方法生效！");
	 	};
	}
	// 实例化 此时会执行构造函数 console.log("开始执行_1")，缺点每个实例都会创建与构造函数同样的一组方法
 	var s = new Animal_1();
 	console.log("实例的constructor==构造器：" + s.constructor.name);	
 	s.showName(); // 单独调用内部方法
 	s.sayHi();
 	s.newMethod();
 	
	
	//======= 1.1.1 静态私有变量 （避免构造函数模式实例会创建同样一组方法的问题）
	(function(){
		// 构造函数 没有var声明成为全局变量 能在私有作用域之外被访问到但是严格模式下会报错
		Animal_1_1 = function(){ 
			console.log("开始执行_1_1  静态私有变量模式");
			console.log(this);
			var name = "Animal_1_1"; // 构造函数中通常用 var定义私有变量，this.name定义公共变量
    
			//  在原型上定义特权(公共)方法 
			if(typeof this.showName !== "function"){ // 避免重复定义
	   		Animal_1_1.prototype.showName = function(){    
	        console.log(name); 	    
		    }
	   	}
			if(typeof this.sayHi !== "function"){
	   		Animal_1_1.prototype.sayHi = function(){
		   		console.log("hi_1_1");
		   	};
		  }
			if(typeof this.setName !== "function"){
		   	Animal_1_1.prototype.setName = function(value){
		   		name = value;
		   	};
	    }
		}
	})();
	var s_1 = new Animal_1_1(); // 实例共享
	var s_1_1 = new Animal_1_1(); // 但一旦一个实例上改变name值，其他实例都会收影响；此法适合只读的数据调用
	console.log(s_1.name); // undefined name是私有变量
	s_1_1.setName("TT");
	s_1.showName();
	s_1.sayHi();
	
	
	//======== 2.闭包 return fn
	function animal_2(){   
		console.log("开始执行_2 闭包方法");
		console.log(this);
  	var name = "animal_2"; 
  	this.closures = function(param){ 
			switch(param){
				case 1:
        	console.log(name);
        	break;
        case 2:
        	console.log("hi_2");
        	break;
        default:
        	console.log("参数错误");
      }
  	}
    // 通过return返回多个值，通过对象属性访问
	  return { 
	   	closures01 : this.closures,
			closures02 :  function(){
				console.log(":::::第二个闭包");
			} 
		}
	}
	var s = animal_2(); // 引用函数  
	s.closures01(1); // 执行闭包函数	
	s.closures02();	
	
	console.log("以上存在全局变量是" + window.name);
	
	
	// 通过基本类型原型添加方法 （公式）
	Function.prototype.method = function(name, fn){
		// 判断不存在此方法才添加，避免重复添加
		if(!this.prototype[name]) {
			this.prototype[name] = fn;
			return this;
		}
	};
	// 给字符串类型添加去掉空格方法（具体实现）。 类似插件实现
	String.method("trim",function(){
		return this.replace(/^\s+|\s+$/g,""); // 正则匹配去掉开头和末尾空格
	});
	var str = "  kon gge  ";
	console.log("'"+str+"'"); 
	console.log("'"+str.trim()+"'");
		
}