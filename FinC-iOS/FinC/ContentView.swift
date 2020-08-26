//
//  ContentView.swift
//  FinC
//
//  Created by Phumin Walaipatchara on 8/24/20.
//

import SwiftUI
import LinkKit

struct ContentView: View {
    static private var account: [[String: String]] = [["institution_name" : "Chase", "access_token" : "access-sandbox-5a3b768e-2c32-46d5-a1dd-d2f73aaf30af"], ["institution_name" : "Bank of America", "access_token" : "access-sandbox-f782836c-775c-4f88-8fff-f465810e85f3"], ["institution_name" : "Wells Fargo", "access_token" : "access-sandbox-99a6b66c-4b22-4bb5-87f0-5ce1850e95d2"]]
    
    var body: some View {
        NavigationView {
            VStack {
                Text("Hello, world!")
                    .padding()
                Spacer()
            }
            .navigationBarItems(leading: Text(""),
                                trailing: Image(systemName: "plus.circle.fill")
                                          .font(.largeTitle)
                                          .onTapGesture(count: 1,
                                                        perform: {
                                                            print("TODO: Plaid Link")
                                                        }
                                                        )
                                )
            .navigationBarTitle(Text("Accounts"))
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationView {
            ContentView()
        }
    }
}
