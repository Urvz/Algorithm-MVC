using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace my_new_app.Controllers
{
    [Route("api/[controller]")]
    public class SortAlgorithmController : Controller
    {

		[HttpPost("[action]")]
		public Search Searchs()
		{
			//init variables here, I have tried using dynamic to support double, int and string 
			//however it would not work due to types changing, will try to debug this on
			var input = new StreamReader(Request.Body).ReadToEnd();
			dynamic inputClone = JsonConvert.DeserializeObject(input);
			int[] myInput = inputClone.userArray.ToObject<int[]>();
			int[][] jaggedArray = new int[myInput.Length][];

			void merge(int[] Arr, int start, int mid, int end) {
				// create a temp array
				int[] temp = new int[end - start + 1];
				//int temp[end - start + 1];

				// crawlers for both intervals and for temp
				int i = start, j = mid + 1, k = 0;

				// traverse both arrays and in each iteration add smaller of both elements in temp 
				while (i <= mid && j <= end)
				{
					if (Arr[i] <= Arr[j])
					{
						temp[k] = Arr[i];
						k += 1; i += 1;
					}
					else
					{
						temp[k] = Arr[j];
						k += 1; j += 1;
					}
				}

				// add elements left in the first interval 
				while (i <= mid)
				{
					temp[k] = Arr[i];
					k += 1; i += 1;
				}

				// add elements left in the second interval 
				while (j <= end)
				{
					temp[k] = Arr[j];
					k += 1; j += 1;
				}

				// copy temp to original interval
				for (i = start; i <= end; i += 1)
				{
					Arr[i] = temp[i - start];
					
				}
			}

			// Arr is an array of integer type
			// start and end are the starting and ending index of current interval of Arr

			void mergeSort(int[] Arr, int start, int end)
			{

				if (start < end)
				{
					int mid = (start + end) / 2;
					mergeSort(Arr, start, mid);
					mergeSort(Arr, mid + 1, end);
					merge(Arr, start, mid, end);
				}
			}

			
			void quickSort(int[] arr, int left, int right)
			{
				if (left < right)
				{	//see if left is smaller than right to initialize pivot
					int pivot = Partition(arr, left, right);

					//check value of pivot to see if array has been partitioned correctly, then quicksort recursively
					if (pivot > 1)
					{
						quickSort(arr, left, pivot - 1);
					}
					if (pivot + 1 < right)
					{
						quickSort(arr, pivot + 1, right);
					}
				}

			}

			int Partition(int[] arr, int left, int right)
			{
				//use base value of left aas pivot
				int pivot = arr[left];
				while (true)
				{

					while (arr[left] < pivot)
					{
						left++;
					}

					while (arr[right] > pivot)
					{
						right--;
					}

					//swap position of elements if the smaller one comes before the larger one
					if (left < right)
					{
						int temp = arr[left];
						arr[left] = arr[right];
						arr[right] = temp;

						if (arr[left] == arr[right])
							left++;
					}
					else
					{
						return right;
					}
				}
			}

			void bubbleSort(int[] arr)
			{
				//I have tried using a jagged 2d array to store the steps of my sort method, however it is being overwritten..would love to chat about this
				int temp = 0;
				int jagged = 0;
				
				//simple bubble sort checking every element and comparing it to the one beside it
				for (int write = 0; write < arr.Length; write++)
				{
					for (int sort = 0; sort < arr.Length - 1; sort++)
					{
						if (arr[sort] > arr[sort + 1])
						{
							temp = arr[sort + 1];
							arr[sort + 1] = arr[sort];
							arr[sort] = temp;
						}
					}
				}
			}

			//use the sorting method chosed by the user in the front-end
			if (inputClone.sort == 0)
			{
				mergeSort(myInput, 0, myInput.Length - 1);
			}
			else if (inputClone.sort == 1)
			{
				quickSort(myInput, 0, myInput.Length - 1);
			}
			else
			{
				bubbleSort(myInput);
			}
			string newArray = JsonConvert.SerializeObject(myInput);
			int type = inputClone.sort;

			//return the array, sort method(to see if correct method has been chosen), and the steps
			return new Search
			{
					Inputs = newArray,
					SortMethod = type,
					Steps = jaggedArray
			};
		}

		//model in the controller for simplification
		public class Search
		{
			public string Inputs { get; set; }
			public int SortMethod { get; set; }
			public Array Steps { get; set; }
		}

		
    }
}
